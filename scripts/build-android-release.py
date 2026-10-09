#!/usr/bin/env python3
"""Build using the persistent local release key; never generate a replacement."""
import os
from pathlib import Path
import subprocess
import hashlib

root = Path(__file__).resolve().parent.parent
credentials = Path.home() / '.local/share/cinepulse-signing/release.env'
if not credentials.exists():
    raise SystemExit(f'Release signing credentials missing: {credentials}')
env = os.environ.copy()
env.update(dict(line.split('=', 1) for line in credentials.read_text().splitlines() if line))
env.setdefault('JAVA_HOME', str(Path.home() / 'jdks/jdk21'))
env.setdefault('ANDROID_HOME', str(Path.home() / 'android-sdk'))
env['PATH'] = env['JAVA_HOME'] + '/bin:' + env['PATH']
certificate = subprocess.run([
    env['JAVA_HOME'] + '/bin/keytool', '-exportcert',
    '-keystore', env['ANDROID_KEYSTORE_PATH'],
    '-storepass:env', 'ANDROID_KEYSTORE_PASSWORD',
    '-alias', env['ANDROID_KEY_ALIAS'],
], env=env, capture_output=True, check=True).stdout
if hashlib.sha256(certificate).hexdigest() != '429f07887bd3ff17992faa552ff32f4f6eaea5a1dc7cfe27978578905e15e3d5':
    raise SystemExit('Local key differs from the existing release key. Use GitHub Actions with the existing ANDROID_KEYSTORE secrets, or configure the matching local key.')
subprocess.run(['bash', 'gradlew', 'assembleRelease', '--no-daemon'], cwd=root / 'android', env=env, check=True)
(root / 'release').mkdir(exist_ok=True)
import shutil
shutil.copy2(root / 'android/app/build/outputs/apk/release/app-release.apk', root / 'release/cinepulse.apk')
