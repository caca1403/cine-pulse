/**
 * Offline smoke test for the Scratchpad client module: it loads the module
 * through the same `__ModuleLoader__` contract the Web page uses, mounts the
 * factory with a stub React and a stub plugin context, and asserts that the
 * launcher and the main-area page are registered with the expected ids.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8');

const createElement = (type, props, ...children) => ({ type, props, children });
const React = { createElement, useState: (v) => [typeof v === 'function' ? v() : v, () => {}], useRef: (v) => ({ current: v }), useEffect: () => {} };

const registrations = [];
const injections = [];
const localeDictionaries = [];

const ctx = {
  effect(fn) {
    return fn();
  },
  locale: {
    register(ns, dicts) {
      localeDictionaries.push({ ns, dicts });
      return () => {};
    },
    bind: (ns) => (key, params) =>
      String(dictsFor(ns)[key] ?? key).replace(/\{(\w+)\}/g, (m, name) => (params && name in params ? String(params[name]) : m)),
  },
  slots: {
    inject(key, callback) {
      injections.push(key);
      return callback();
    },
    register(options, component) {
      registrations.push({ options, component });
      return () => {};
    },
  },
  layout: { selectPanel(panelId) {
    assert.equal(panelId, null);
  } },
};

let installed;
function dictsFor(ns) {
  const found = localeDictionaries.find((entry) => entry.ns === ns);
  return found ? found.dicts.en : {};
}

globalThis.window = {
  __ModuleLoader__: {
    load({ id, factory }) {
      assert.equal(id, '@local/sidebar-scratchpad');
      installed = factory((name) => {
        assert.equal(name, 'react');
        return React;
      });
    },
  },
  localStorage: {
    store: new Map(),
    getItem(key) {
      return this.store.has(key) ? this.store.get(key) : null;
    },
    setItem(key, value) {
      this.store.set(key, String(value));
    },
    removeItem(key) {
      this.store.delete(key);
    },
  },
  setTimeout: () => 0,
  clearTimeout: () => {},
};

vm.runInThisContext(source, { filename: 'client.js' });

assert.ok(installed, 'module loader received a factory');
assert.deepEqual(installed.inject, ['slots', 'locale', 'layout']);

installed.apply(ctx);

assert.deepEqual(injections, ['main', 'sidebar.panellist'], 'launcher and page injected');
assert.equal(localeDictionaries.length, 1);
assert.equal(localeDictionaries[0].ns, 'sidebarScratchpad');
assert.ok(localeDictionaries[0].dicts.en.panel, 'English dictionary has the panel label');
assert.ok(localeDictionaries[0].dicts.tr.panel, 'Turkish dictionary has the panel label');

const main = registrations.find((entry) => entry.options.name === 'main');
assert.ok(main, 'main panel registered');
assert.equal(main.options.key, 'scratchpad');

const launcher = registrations.find((entry) => entry.options.name === 'sidebar.panellist');
assert.ok(launcher, 'sidebar launcher registered');
assert.equal(launcher.options.id, 'scratchpad');
assert.equal(launcher.options.label(), 'Scratchpad');

// Components return plain elements without touching the document.
const icon = launcher.component({ size: 16, active: false });
assert.equal(icon.type, 'svg');
const page = main.component({ t: (key) => key, goToConversation: () => {} });
assert.equal(page.type, 'section');
assert.equal(page.props['aria-label'], 'title');

console.log('client smoke test: PASS', {
  inject: installed.inject,
  injections,
  registrations: registrations.map((entry) => entry.options.name + ':' + (entry.options.id ?? entry.options.key)),
});
