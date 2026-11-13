window.__ModuleLoader__.load({
	id: '@local/sidebar-scratchpad',
	factory(require) {
		const React = require('react');
		const h = React.createElement;

		/** Locale namespace owned by this plugin. */
		const NS = 'sidebarScratchpad';
		/** Panel id shared by the sidebar launcher and the main-area page. */
		const PANEL_ID = 'scratchpad';
		/** Browser-local storage key for the note body. */
		const STORAGE_KEY = 'dsh.sidebar-scratchpad.note';

		const en = {
			panel: 'Scratchpad',
			title: 'Scratchpad',
			intro: 'A quick note that stays in this browser. Nothing is sent to the model.',
			placeholder: 'Start typing a quick note…',
			clear: 'Clear note',
			back: 'Back to conversation',
			saving: 'Saving…',
			saved: 'Saved',
			empty: 'No note yet.',
			chars: '{count} characters',
			unavailable: 'This browser does not allow local storage, so the note cannot be saved.',
		};
		const tr = {
			panel: 'Not defteri',
			title: 'Not defteri',
			intro: 'Bu tarayıcıda kalan hızlı bir not. Modele hiçbir şey gönderilmez.',
			placeholder: 'Hızlı bir not yazmaya başlayın…',
			clear: 'Notu temizle',
			back: 'Sohbete dön',
			saving: 'Kaydediliyor…',
			saved: 'Kaydedildi',
			empty: 'Henüz not yok.',
			chars: '{count} karakter',
			unavailable: 'Bu tarayıcı yerel depolamaya izin vermiyor, not kaydedilemez.',
		};

		/** Styles bound to the host theme tokens; artwork alone may use literal colors. */
		const STYLE = `
.ssp-page {
	box-sizing: border-box;
	height: 100%;
	display: flex;
	flex-direction: column;
	padding: 28px clamp(20px, 4vw, 48px) 32px;
	color: var(--dsw-alias-label-primary);
	background: var(--dsw-alias-bg-base);
}
[data-platform="darwin"] .ssp-page { padding-top: calc(28px + var(--dsh-frame-top-clearance, 0px)); }
.ssp-inner { width: 100%; max-width: 960px; margin: 0 auto; display: flex; flex-direction: column; flex: 1; min-height: 0; }
.ssp-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.ssp-title { margin: 0; font-size: 20px; font-weight: 500; line-height: 28px; }
.ssp-intro { margin: 4px 0 0; font-size: 13px; line-height: 20px; color: var(--dsw-alias-label-secondary); }
.ssp-card { margin-top: 20px; flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden;
	border: .5px solid var(--dsw-alias-border-l2); border-radius: 14px; background: var(--dsw-alias-bg-layer-1); }
.ssp-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 12px;
	border-bottom: .5px solid var(--dsw-alias-border-l1); color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 18px; }
.ssp-meta { display: inline-flex; align-items: center; gap: 10px; font-variant-numeric: tabular-nums; }
.ssp-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--dsw-alias-state-success-primary); display: inline-block; }
.ssp-dot[data-state="saving"] { background: var(--dsw-alias-label-secondary); }
.ssp-dot[data-state="unavailable"] { background: var(--dsw-alias-state-warn-primary); }
.ssp-textarea { flex: 1; min-height: 220px; resize: none; border: 0; outline: none; padding: 16px 18px;
	background: transparent; color: var(--dsw-alias-label-primary); font: inherit; font-size: 14px; line-height: 22px; }
.ssp-textarea::placeholder { color: var(--dsw-alias-label-secondary); opacity: .8; }
.ssp-button { border: .5px solid var(--dsw-alias-border-l2); border-radius: 8px; height: 28px; padding: 0 10px;
	background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12.5px;
	line-height: 20px; cursor: pointer; white-space: nowrap; }
.ssp-button[data-kind="primary"] { background: var(--dsw-alias-brand-primary); border-color: transparent;
	color: var(--dsw-alias-bg-base); }
.ssp-button:active { transform: translateY(.5px); }
.ssp-button:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
@media (prefers-reduced-motion: reduce) { .ssp-button:active { transform: none; } }
`;

		/** One style element per mounted plugin surface; unmounting removes it. */
		function StyleTag() {
			return h('style', { 'data-plugin': '@local/sidebar-scratchpad' }, STYLE);
		}

		function readStored() {
			try {
				return window.localStorage.getItem(STORAGE_KEY) ?? '';
			} catch {
				return '';
			}
		}

		function storageAvailable() {
			try {
				window.localStorage.setItem('dsh.sidebar-scratchpad.probe', '1');
				window.localStorage.removeItem('dsh.sidebar-scratchpad.probe');
				return true;
			} catch {
				return false;
			}
		}

		/**
		 * Sidebar launcher glyph. Inherits the host row color so the selected
		 * and hover states stay the shell's.
		 * @param props - sidebar panel icon owner props (`size`, `active`).
		 */
		function ScratchpadIcon({ size, active }) {
			const edge = Math.max(12, size);
			return h(
				'svg',
				{
					width: edge,
					height: edge,
					viewBox: '0 0 20 20',
					fill: 'none',
					stroke: 'currentColor',
					strokeWidth: 1.5,
					strokeLinecap: 'round',
					strokeLinejoin: 'round',
					'aria-hidden': true,
					focusable: 'false',
					'data-active': active ? 'true' : undefined,
				},
				h('path', { d: 'M4.5 3.5h7.2L15.5 7.3v9.2H4.5z', opacity: 0.55 }),
				h('path', { d: 'M11.5 3.6v3.9h3.9' }),
				h('path', { d: 'M7 10.4h4.6M7 13.2h3.2' }),
			);
		}

		/**
		 * Main-area Scratchpad page: one autosaving note, browser-local only.
		 * @param props - injected `t` and `goToConversation`.
		 */
		function ScratchpadPage(props) {
			const { t, goToConversation } = props;
			const [text, setText] = React.useState(readStored);
			const [status, setStatus] = React.useState(() => (storageAvailable() ? 'saved' : 'unavailable'));
			const storedRef = React.useRef(text);
			const areaRef = React.useRef(null);

			React.useEffect(() => {
				if (status === 'unavailable') return;
				if (text === storedRef.current) return;
				setStatus('saving');
				const timer = window.setTimeout(() => {
					let next = 'saved';
					try {
						window.localStorage.setItem(STORAGE_KEY, text);
					} catch {
						next = 'unavailable';
					}
					storedRef.current = text;
					setStatus(next);
				}, 300);
				return () => window.clearTimeout(timer);
			}, [text, status]);

			const clear = () => {
				storedRef.current = '';
				try {
					window.localStorage.removeItem(STORAGE_KEY);
				} catch {
					setStatus('unavailable');
				}
				setText('');
				areaRef.current?.focus();
			};

			const statusText = status === 'unavailable' ? t('unavailable') : status === 'saving' ? t('saving') : t('saved');

			return h(
				'section',
				{ className: 'ssp-page', 'aria-label': t('title') },
				h(StyleTag),
				h(
					'div',
					{ className: 'ssp-inner' },
					h(
						'div',
						{ className: 'ssp-head' },
						h(
							'div',
							null,
							h('h1', { className: 'ssp-title' }, t('title')),
							h('p', { className: 'ssp-intro' }, t('intro')),
						),
						h(
							'button',
							{ type: 'button', className: 'ssp-button', onClick: goToConversation },
							t('back'),
						),
					),
					h(
						'div',
						{ className: 'ssp-card' },
						h(
							'div',
							{ className: 'ssp-bar' },
							h(
								'span',
								{ className: 'ssp-meta' },
								h('span', { className: 'ssp-dot', 'data-state': status, 'aria-hidden': true }),
								h('span', { role: 'status' }, statusText),
								h('span', null, t('chars', { count: text.length })),
							),
							h(
								'button',
								{
									type: 'button',
									className: 'ssp-button',
									onClick: clear,
									disabled: text.length === 0,
									style: text.length === 0 ? { opacity: 0.5, cursor: 'default' } : undefined,
								},
								t('clear'),
							),
						),
						h('textarea', {
							ref: areaRef,
							className: 'ssp-textarea',
							value: text,
							placeholder: t('placeholder'),
							'aria-label': t('title'),
							spellCheck: true,
							onChange: (event) => setText(event.target.value),
						}),
					),
				),
			);
		}

		return {
			inject: ['slots', 'locale', 'layout'],
			apply(ctx) {
				ctx.effect(
					() =>
						ctx.locale.register(NS, {
							en,
							tr,
						}),
					'sidebar-scratchpad: dictionaries',
				);
				const t = ctx.locale.bind(NS);

				const goToConversation = () => ctx.layout.selectPanel(null);

				ctx.effect(() => {
					const disposeMain = ctx.slots.inject('main', () =>
						ctx.slots.register(
							{
								name: 'main',
								key: PANEL_ID,
								locale: NS,
								inject: () => ({ t, goToConversation }),
							},
							ScratchpadPage,
						),
					);
					const disposeLauncher = ctx.slots.inject('sidebar.panellist', () =>
						ctx.slots.register(
							{
								name: 'sidebar.panellist',
								id: PANEL_ID,
								order: 20,
								locale: NS,
								label: () => t('panel'),
							},
							ScratchpadIcon,
						),
					);
					return () => {
						disposeLauncher();
						disposeMain();
					};
				}, 'sidebar-scratchpad: panel and launcher');
			},
		};
	},
});
