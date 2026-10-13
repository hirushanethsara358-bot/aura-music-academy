import { useState } from 'react';
import { Check, Copy, Database, KeyRound, Lock, RefreshCw, ShieldCheck } from 'lucide-react';
import {
  clearRuntimeFirebaseConfig,
  DEFAULT_AURA_RTDB_URL,
  getActiveFirebaseConfig,
  getFirebaseBackendSummary,
  saveRuntimeFirebaseConfig,
} from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { StatusBanner } from '../../components/feedback/Feedback';
import rtdbRulesJson from '../../../firebase/database.rules.json';

const RTDB_RULES_TEXT = JSON.stringify(rtdbRulesJson, null, 2);

const FIRESTORE_RULES_SUMMARY = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isAdmin() {
      return isSignedIn() && (
        request.auth.token.admin == true ||
        exists(/databases/$(database)/documents/admins/$(request.auth.uid))
      );
    }
    function isOwner(uid) { return isSignedIn() && request.auth.uid == uid; }

    match /admins/{uid} {
      allow read: if isOwner(uid) || isAdmin();
      allow write: if false; // Console-only admin registry
    }
    match /courses/{courseId} {
      allow read: if resource.data.published == true || isAdmin();
      allow create, update, delete: if isAdmin();
    }
    match /lessons/{lessonId} {
      allow read: if resource.data.published == true || isAdmin();
      allow create, update, delete: if isAdmin();
    }
    match /quizzes/{quizId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    match /users/{uid} {
      allow read, delete: if isOwner(uid) || isAdmin();
      allow create, update: if isOwner(uid) && request.resource.data.uid == uid
        && !('role' in request.resource.data) && !('admin' in request.resource.data);
    }
    match /users/{uid}/progress/{lessonId} {
      allow read, delete: if isOwner(uid) || isAdmin();
      allow create, update: if isOwner(uid) && request.resource.data.uid == uid
        && request.resource.data.lessonId == lessonId
        && request.resource.data.completed is bool;
    }
    match /users/{uid}/bookmarks/{lessonId} {
      allow read, delete: if isOwner(uid) || isAdmin();
      allow create: if isOwner(uid) && request.resource.data.uid == uid
        && request.resource.data.lessonId == lessonId;
      allow update: if false;
    }
    match /quizAttempts/{attemptId} {
      allow read: if isAdmin() || (isSignedIn() && resource.data.uid == request.auth.uid);
      allow create: if isSignedIn() && request.resource.data.uid == request.auth.uid;
      allow update, delete: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`;

export function FirebaseRulesPanel() {
  const { user } = useAuth();
  const summary = getFirebaseBackendSummary();
  const activeConfig = getActiveFirebaseConfig();

  const [copiedTarget, setCopiedTarget] = useState<'rtdb' | 'firestore' | 'uid' | null>(null);
  const [activeTab, setActiveTab] = useState<'rtdb' | 'firestore' | 'connect'>('rtdb');

  const [apiKey, setApiKey] = useState(activeConfig?.apiKey ?? '');
  const [authDomain, setAuthDomain] = useState(
    activeConfig?.authDomain ?? 'auramusic-daa98.firebaseapp.com'
  );
  const [databaseURL, setDatabaseURL] = useState(
    activeConfig?.databaseURL ?? DEFAULT_AURA_RTDB_URL
  );
  const [projectId, setProjectId] = useState(activeConfig?.projectId ?? 'auramusic-daa98');
  const [storageBucket, setStorageBucket] = useState(
    activeConfig?.storageBucket ?? 'auramusic-daa98.firebasestorage.app'
  );
  const [messagingSenderId, setMessagingSenderId] = useState(
    activeConfig?.messagingSenderId ?? '466766006378'
  );
  const [appId, setAppId] = useState(
    activeConfig?.appId ?? '1:466766006378:web:5e2012d6c26d623a9d6213'
  );
  const [configNotice, setConfigNotice] = useState<string | null>(null);

  async function copyText(text: string, target: 'rtdb' | 'firestore' | 'uid') {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTarget(target);
      setTimeout(() => setCopiedTarget(null), 2500);
    } catch {
      // Clipboard API fallback ignored in restricted test contexts
    }
  }

  function handleSaveConfig() {
    if (!apiKey.trim() || !authDomain.trim() || !projectId.trim() || !appId.trim()) {
      setConfigNotice('කරුණාකර API Key, Auth Domain, Project ID සහ App ID ඇතුළත් කරන්න.');
      return;
    }
    saveRuntimeFirebaseConfig({
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      databaseURL: databaseURL.trim() || DEFAULT_AURA_RTDB_URL,
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    });
    setConfigNotice(
      'Firebase සැකසුම් සුරකින ලදී. නව සම්බන්ධතාව සක්‍රීය කිරීමට පිටුව Refresh කරන්න.'
    );
  }

  function handleClearConfig() {
    clearRuntimeFirebaseConfig();
    setConfigNotice('බ්‍රවුසරයේ තාවකාලික Firebase සැකසුම් ඉවත් කරන ලදී.');
  }

  return (
    <section
      className="surface-card"
      id="firebase-rules"
      style={{ borderLeft: '4px solid var(--accent-cyan)', display: 'grid', gap: 'var(--space-4)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.08rem', marginBottom: '0.25rem' }}>
            <Database size={18} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
            Firebase Realtime Database සහ Security Rules මධ්‍යස්ථානය
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            Project: <code>{summary.projectId ?? 'auramusic-daa98'}</code> · Realtime DB:{' '}
            <code>{summary.databaseURL ?? DEFAULT_AURA_RTDB_URL}</code>
          </p>
        </div>

        <span
          className={`badge ${summary.mode === 'rtdb+firestore' ? 'badge-success' : 'badge-amber'}`}
          style={{ alignSelf: 'flex-start' }}
        >
          {summary.mode === 'rtdb+firestore'
            ? 'Realtime DB + Firestore සම්බන්ධිතයි'
            : summary.mode === 'firestore'
              ? 'Firestore සම්බන්ධිතයි'
              : 'දේශීය ප්‍රකාරය (Local Studio Mode)'}
        </span>
      </div>

      {/* Step-by-step instructions in Sinhala */}
      <div
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
        }}
      >
        <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
          <ShieldCheck size={16} style={{ verticalAlign: '-3px', marginRight: 5 }} aria-hidden="true" />
          Firebase Console හි Security Rules සහ Admin සැකසීමේ පියවර 3:
        </strong>
        <ol style={{ margin: 0, paddingLeft: '1.2rem', display: 'grid', gap: '0.35rem' }}>
          <li>
            <strong>Realtime Database Rules ඇතුළත් කිරීම:</strong> Firebase Console →{' '}
            <strong>Realtime Database → Rules</strong> වෙත ගොස් පහත ඇති{' '}
            <code>database.rules.json</code> කේතය පිටපත් කර (Copy) එහි අලවා{' '}
            <strong>Publish</strong> ඔබන්න.
          </li>
          <li>
            <strong>Authentication සක්‍රීය කිරීම:</strong> Firebase Console →{' '}
            <strong>Authentication → Sign-in method</strong> වෙත ගොස්{' '}
            <strong>Email/Password</strong> සක්‍රීය (Enable) කරන්න.
          </li>
          <li>
            <strong>ඔබේ ගිණුමට Admin අවසර ලබා දීම:</strong> වෙබ් අඩවියේ ලියාපදිංචි වී පිවිසීමෙන් පසු,
            Firebase Console → <strong>Realtime Database → Data</strong> වෙත ගොස් root (<code>/</code>)
            යටතේ <code>admins</code> නමින් node එකක් සාදා, ඔබේ UID එක යටතේ අගය{' '}
            <code>true</code> ලෙස සකසන්න (උදා: <code>/admins/{user?.uid ?? 'ඔබේ_UID'}: true</code>).
            මෙම <code>/admins</code> කොටසට බ්‍රවුසරයෙන් කිසිවෙකුට ලිවිය නොහැක (<code>&quot;.write&quot;: false</code>).
          </li>
        </ol>

        {user && (
          <div
            style={{
              marginTop: 'var(--space-3)',
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <span>
              <KeyRound size={14} style={{ verticalAlign: '-2px', marginRight: 5 }} aria-hidden="true" />
              ඔබේ වත්මන් ගිණුමේ UID: <code>{user.uid}</code>{' '}
              {user.isAdmin ? (
                <span className="badge badge-success" style={{ marginLeft: 6 }}>Admin සක්‍රීයයි</span>
              ) : (
                <span className="badge" style={{ marginLeft: 6 }}>ශිෂ්‍ය ගිණුම</span>
              )}
            </span>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => void copyText(user.uid, 'uid')}
            >
              {copiedTarget === 'uid' ? (
                <>
                  <Check size={13} aria-hidden="true" /> UID පිටපත් විය
                </>
              ) : (
                <>
                  <Copy size={13} aria-hidden="true" /> UID පිටපත් කරන්න
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'rtdb'}
          className={`btn btn-sm ${activeTab === 'rtdb' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('rtdb')}
        >
          <Lock size={13} aria-hidden="true" /> Realtime Database Rules (JSON)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'firestore'}
          className={`btn btn-sm ${activeTab === 'firestore' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('firestore')}
        >
          <Lock size={13} aria-hidden="true" /> Cloud Firestore Rules
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'connect'}
          className={`btn btn-sm ${activeTab === 'connect' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('connect')}
        >
          <RefreshCw size={13} aria-hidden="true" /> Firebase Connection සැකසුම්
        </button>
      </div>

      {activeTab === 'rtdb' && (
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              ගොනුව: <code>firebase/database.rules.json</code> · ඉලක්කය:{' '}
              <code>https://auramusic-daa98-default-rtdb.asia-southeast1.firebasedatabase.app/</code>
            </span>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => void copyText(RTDB_RULES_TEXT, 'rtdb')}
            >
              {copiedTarget === 'rtdb' ? (
                <>
                  <Check size={14} aria-hidden="true" /> Realtime DB Rules පිටපත් විය!
                </>
              ) : (
                <>
                  <Copy size={14} aria-hidden="true" /> Realtime DB Rules පිටපත් කරන්න (Copy)
                </>
              )}
            </button>
          </div>
          <pre
            style={{
              margin: 0,
              padding: 'var(--space-3)',
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              maxHeight: 340,
              overflow: 'auto',
              color: 'var(--text-primary)',
            }}
          >
            {RTDB_RULES_TEXT}
          </pre>
        </div>
      )}

      {activeTab === 'firestore' && (
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              ගොනුව: <code>firebase/firestore.rules</code> (සම්පූර්ණ ගොනුව repository හි ඇත)
            </span>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => void copyText(FIRESTORE_RULES_SUMMARY, 'firestore')}
            >
              {copiedTarget === 'firestore' ? (
                <>
                  <Check size={14} aria-hidden="true" /> Firestore Rules පිටපත් විය!
                </>
              ) : (
                <>
                  <Copy size={14} aria-hidden="true" /> Firestore Rules පිටපත් කරන්න (Copy)
                </>
              )}
            </button>
          </div>
          <pre
            style={{
              margin: 0,
              padding: 'var(--space-3)',
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              maxHeight: 340,
              overflow: 'auto',
              color: 'var(--text-primary)',
            }}
          >
            {FIRESTORE_RULES_SUMMARY}
          </pre>
        </div>
      )}

      {activeTab === 'connect' && (
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          {configNotice && (
            <StatusBanner tone="info" titleSi="Firebase සැකසුම්">
              {configNotice}
            </StatusBanner>
          )}
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            ඔබේ <code>.env.local</code> ගොනුව හරහා හෝ පහත පෝරමය හරහා Firebase Web App සැකසුම්
            සම්බන්ධ කළ හැක. මතක තබා ගන්න: Firebase Client Config යනු ප්‍රසිද්ධ හඳුනාගැනීමේ
            තොරතුරු පමණි — සැබෑ දත්ත ආරක්ෂාව ක්‍රියාත්මක වන්නේ ඉහත Security Rules මගිනි.
          </p>
          <div className="lab-control-row" style={{ marginBottom: 0 }}>
            <div className="lab-control" style={{ flexBasis: 260 }}>
              <label htmlFor="fb-api-key">VITE_FIREBASE_API_KEY</label>
              <input
                id="fb-api-key"
                type="text"
                className="input-field"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
              />
            </div>
            <div className="lab-control" style={{ flexBasis: 260 }}>
              <label htmlFor="fb-project-id">VITE_FIREBASE_PROJECT_ID</label>
              <input
                id="fb-project-id"
                type="text"
                className="input-field"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              />
            </div>
            <div className="lab-control" style={{ flexBasis: 340 }}>
              <label htmlFor="fb-db-url">VITE_FIREBASE_DATABASE_URL (Realtime DB)</label>
              <input
                id="fb-db-url"
                type="url"
                className="input-field"
                value={databaseURL}
                onChange={(e) => setDatabaseURL(e.target.value)}
              />
            </div>
          </div>
          <div className="lab-control-row" style={{ marginBottom: 0 }}>
            <div className="lab-control" style={{ flexBasis: 240 }}>
              <label htmlFor="fb-auth-domain">VITE_FIREBASE_AUTH_DOMAIN</label>
              <input
                id="fb-auth-domain"
                type="text"
                className="input-field"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
              />
            </div>
            <div className="lab-control" style={{ flexBasis: 240 }}>
              <label htmlFor="fb-storage-bucket">VITE_FIREBASE_STORAGE_BUCKET</label>
              <input
                id="fb-storage-bucket"
                type="text"
                className="input-field"
                value={storageBucket}
                onChange={(e) => setStorageBucket(e.target.value)}
              />
            </div>
            <div className="lab-control" style={{ flexBasis: 180 }}>
              <label htmlFor="fb-sender-id">MESSAGING_SENDER_ID</label>
              <input
                id="fb-sender-id"
                type="text"
                className="input-field"
                value={messagingSenderId}
                onChange={(e) => setMessagingSenderId(e.target.value)}
              />
            </div>
            <div className="lab-control" style={{ flexBasis: 260 }}>
              <label htmlFor="fb-app-id">VITE_FIREBASE_APP_ID</label>
              <input
                id="fb-app-id"
                type="text"
                className="input-field"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveConfig}>
              Firebase සැකසුම් සුරකින්න
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleClearConfig}>
              තාවකාලික සැකසුම් ඉවත් කරන්න
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
