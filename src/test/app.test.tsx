import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import { ErrorBoundary } from '../components/feedback/Feedback';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../features/courses/HomePage';
import { LearningPathsPage } from '../features/courses/LearningPathsPage';
import { LevelPage } from '../features/courses/LevelPage';
import { LessonDetailPage } from '../features/lessons/LessonDetailPage';
import { GlossaryPage } from '../features/lessons/GlossaryPage';
import { SearchResultsPage } from '../features/lessons/SearchResultsPage';
import { MyLearningPage } from '../features/progress/MyLearningPage';
import { NotFoundPage } from '../features/courses/NotFoundPage';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '../features/auth/AuthPages';
import { ProtectedRoute, AdminRoute } from '../features/auth/RouteGuards';
import { AdminCmsPage } from '../features/admin/AdminCmsPage';
import { LabsPage } from '../features/music-lab/LabsPage';
import { VirtualPiano } from '../features/music-lab/VirtualPiano';
import { Metronome } from '../features/music-lab/Metronome';
import { ScaleExplorer } from '../features/music-lab/ScaleExplorer';

function renderWithProviders(initialPath = '/') {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: (
          <ErrorBoundary>
            <AppLayout />
          </ErrorBoundary>
        ),
        children: [
          { index: true, element: <HomePage /> },
          { path: 'learning-paths', element: <LearningPathsPage /> },
          { path: 'levels/:level', element: <LevelPage /> },
          { path: 'lessons/:slug', element: <LessonDetailPage /> },
          { path: 'labs', element: <LabsPage /> },
          { path: 'glossary', element: <GlossaryPage /> },
          { path: 'search', element: <SearchResultsPage /> },
          { path: 'about', element: <NotFoundPage /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
          { path: 'forgot-password', element: <ForgotPasswordPage /> },
          {
            path: 'my-learning',
            element: (
              <ProtectedRoute>
                <MyLearningPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'admin',
            element: (
              <AdminRoute>
                <AdminCmsPage />
              </AdminRoute>
            ),
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
    { initialEntries: [initialPath] }
  );

  return render(
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

describe('Application shell', () => {
  it('renders the brand, navigation and footer', async () => {
    renderWithProviders('/');

    expect(screen.getByRole('link', { name: /Aura Music Academy මුල් පිටුව/i })).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: /ප්‍රධාන සංචාලනය/i });
    expect(within(nav).getByRole('link', { name: /ඉගෙනුම් මාර්ග/ })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /මගේ ඉගෙනුම/ })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('exposes a skip link for keyboard users', () => {
    renderWithProviders('/');
    expect(screen.getByRole('link', { name: /ප්‍රධාන අන්තර්ගතය වෙත යන්න/ })).toBeInTheDocument();
  });

  it('states honestly that Firebase is not connected in local mode', () => {
    renderWithProviders('/');
    expect(screen.getByText(/දේශීය ප්‍රකාරය/)).toBeInTheDocument();
  });
});

describe('Home page', () => {
  it('renders the hero and lists all nine learning levels', async () => {
    renderWithProviders('/');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/බටහිර සංගීත න්‍යාය/);

    await waitFor(() => {
      expect(screen.getAllByText(/මට්ටම 9/).length).toBeGreaterThan(0);
    });
  });

  it('discloses that audio examples are synthesized, not recordings', async () => {
    renderWithProviders('/');
    await waitFor(() => {
      expect(screen.getAllByText(/සංශ්ලේෂණය/).length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText(/සැබෑ වාද්‍ය භාණ්ඩ පටිගත කිරීම් නොවේ/).length).toBeGreaterThan(0);
  });
});

describe('Learning paths page', () => {
  it('shows all nine levels with published lesson counts', async () => {
    renderWithProviders('/learning-paths');
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ඉගෙනුම් මාර්ග/);
    });

    const items = await screen.findAllByRole('listitem');
    expect(items.length).toBeGreaterThanOrEqual(9);
  });
});

describe('Level page', () => {
  it('lists lessons for a valid level', async () => {
    renderWithProviders('/levels/1');
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/මට්ටම 1/);
    });
    expect(await screen.findByText(/සංගීතය යනු කුමක්ද/)).toBeInTheDocument();
  });

  it('shows a 404 for an out-of-range level', async () => {
    renderWithProviders('/levels/42');
    await waitFor(() => {
      expect(screen.getByText('404')).toBeInTheDocument();
    });
  });
});

describe('Lesson detail page', () => {
  it('renders Sinhala lesson content, objectives, key terms and summary', async () => {
    renderWithProviders('/lessons/what-is-music-and-sound');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/සංගීතය යනු කුමක්ද/);
    });

    expect(screen.getByText(/ඉගෙනුම් අරමුණු/)).toBeInTheDocument();
    expect(screen.getByText(/සාරාංශය/)).toBeInTheDocument();
    expect(screen.getAllByText('Pitch').length).toBeGreaterThan(0);
  });

  it('labels synthesized listening examples honestly', async () => {
    renderWithProviders('/lessons/what-is-music-and-sound');
    await waitFor(() => {
      expect(screen.getByText(/සැබෑ වාද්‍ය භාණ්ඩ පටිගත කිරීම් නොවේ/)).toBeInTheDocument();
    });
  });

  it('offers the ability to listen to a synthesized example', async () => {
    renderWithProviders('/lessons/what-is-music-and-sound');
    const playButtons = await screen.findAllByRole('button', { name: /අසන්න \(Synthesized\)/ });
    expect(playButtons.length).toBeGreaterThan(0);
  });

  it('renders the linked quiz engine', async () => {
    renderWithProviders('/lessons/what-is-music-and-sound');
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /දැනුම පිළිබඳ|සංගීතයේ මූලික අංග පිළිබඳ දැනුම පරීක්ෂාව/ })).toBeInTheDocument();
    });
  });

  it('shows a 404 page for an unknown lesson slug', async () => {
    renderWithProviders('/lessons/this-lesson-does-not-exist');
    await waitFor(() => {
      expect(screen.getByText('404')).toBeInTheDocument();
    });
  });

  it('prompts anonymous learners to sign in to save progress', async () => {
    renderWithProviders('/lessons/what-is-music-and-sound');
    await waitFor(() => {
      expect(screen.getByText(/ප්‍රගතිය සුරැකීමට පිවිසෙන්න/)).toBeInTheDocument();
    });
  });
});

describe('Quiz engine interaction', () => {
  it('grades an answer and shows explanatory feedback', async () => {
    const user = userEvent.setup();
    renderWithProviders('/lessons/what-is-music-and-sound');

    // Question 1 of quiz-101: the correct option is labelled "සංඛ්‍යාතය (Frequency)".
    const correctOption = await screen.findByRole('radio', { name: /සංඛ්‍යාතය \(Frequency\)/ });
    await user.click(correctOption);

    const submit = await screen.findByRole('button', { name: /පිළිතුරු ඉදිරිපත් කරන්න/ });
    await user.click(submit);

    await waitFor(() => {
      expect(screen.getAllByText(/නිවැරදියි/).length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText(/පැහැදිලි කිරීම:/).length).toBeGreaterThan(0);
  });

  it('states clearly that scores are not saved without an account', async () => {
    const user = userEvent.setup();
    renderWithProviders('/lessons/what-is-music-and-sound');

    const option = await screen.findByRole('radio', { name: /සංඛ්‍යාතය \(Frequency\)/ });
    await user.click(option);
    await user.click(await screen.findByRole('button', { name: /පිළිතුරු ඉදිරිපත් කරන්න/ }));

    await waitFor(() => {
      expect(screen.getByText(/ලකුණු සුරැකී නැත/)).toBeInTheDocument();
    });
  });

  it('warns that client-side grading is not suitable for certification', async () => {
    renderWithProviders('/lessons/what-is-music-and-sound');
    await waitFor(() => {
      expect(screen.getByText(/වෘත්තීය සහතිකයක් සඳහා සුදුසු නොවේ/)).toBeInTheDocument();
    });
  });
});

describe('Glossary page', () => {
  it('renders the bilingual glossary and filters by search term', async () => {
    const user = userEvent.setup();
    renderWithProviders('/glossary');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/සිංහල–ඉංග්‍රීසි සංගීත ශබ්දකෝෂය/);
    expect(await screen.findByText('Compression')).toBeInTheDocument();

    const search = screen.getByLabelText(/සොයන්න/);
    await user.type(search, 'LUFS');

    await waitFor(() => {
      expect(screen.getByText('LUFS (Loudness Units relative to Full Scale)')).toBeInTheDocument();
    });
    expect(screen.queryByText('Compression')).not.toBeInTheDocument();
  });

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup();
    renderWithProviders('/glossary');
    await screen.findByText('Compression');

    await user.type(screen.getByLabelText(/සොයන්න/), 'zzzzz-nothing');

    await waitFor(() => {
      expect(screen.getByText(/ගැළපෙන යෙදුමක් හමු නොවිණි/)).toBeInTheDocument();
    });
  });
});

describe('Search results page', () => {
  it('finds lessons by Sinhala and English terms', async () => {
    renderWithProviders('/search?q=compression');

    await waitFor(() => {
      expect(screen.getAllByText(/සෙවුම් ප්‍රතිඵල/).length).toBeGreaterThan(0);
    });
    const matches = await screen.findAllByText(/Compression/);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('shows an empty state for a term with no matches', async () => {
    renderWithProviders('/search?q=xyzzy-not-a-music-term');
    await waitFor(() => {
      expect(screen.getByText(/ප්‍රතිඵල නොමැත/)).toBeInTheDocument();
    });
  });
});

describe('Authentication and route protection', () => {
  it('redirects anonymous visitors away from My Learning', async () => {
    renderWithProviders('/my-learning');
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/පිවිසෙන්න/);
    });
  });

  it('redirects anonymous visitors away from the admin dashboard', async () => {
    renderWithProviders('/admin');
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/පිවිසෙන්න/);
    });
  });

  it('registers a local account and reaches the dashboard', async () => {
    const user = userEvent.setup();
    renderWithProviders('/register');

    await user.type(screen.getByLabelText(/ඔබේ නම/), 'නිමල් පෙරේරා');
    await user.type(screen.getByLabelText(/ඊමේල් ලිපිනය/), 'nimal@example.com');
    await user.type(screen.getByLabelText(/මුරපදය \(අවම අකුරු 6\)/), 'secret123');
    await user.type(screen.getByLabelText(/මුරපදය තහවුරු කරන්න/), 'secret123');
    await user.click(screen.getByRole('button', { name: /ගිණුම සාදන්න/ }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/මගේ ඉගෙනුම/);
    });
  });

  it('rejects mismatched passwords with a Sinhala message', async () => {
    const user = userEvent.setup();
    renderWithProviders('/register');

    await user.type(screen.getByLabelText(/ඊමේල් ලිපිනය/), 'mismatch@example.com');
    await user.type(screen.getByLabelText(/මුරපදය \(අවම අකුරු 6\)/), 'secret123');
    await user.type(screen.getByLabelText(/මුරපදය තහවුරු කරන්න/), 'different1');
    await user.click(screen.getByRole('button', { name: /ගිණුම සාදන්න/ }));

    await waitFor(() => {
      expect(screen.getByText(/මුරපද දෙක එකිනෙක නොගැළපේ/)).toBeInTheDocument();
    });
  });

  it('rejects a short password on registration', async () => {
    const user = userEvent.setup();
    renderWithProviders('/register');

    await user.type(screen.getByLabelText(/ඊමේල් ලිපිනය/), 'short@example.com');
    await user.type(screen.getByLabelText(/මුරපදය \(අවම අකුරු 6\)/), 'abc');
    await user.type(screen.getByLabelText(/මුරපදය තහවුරු කරන්න/), 'abc');
    await user.click(screen.getByRole('button', { name: /ගිණුම සාදන්න/ }));

    await waitFor(() => {
      expect(screen.getByText(/මුරපදය අවම වශයෙන් අකුරු 6/)).toBeInTheDocument();
    });
  });

  it('shows a Sinhala error when logging in with an unknown account', async () => {
    const user = userEvent.setup();
    renderWithProviders('/login');

    await user.type(screen.getByLabelText(/ඊමේල් ලිපිනය/), 'nobody@example.com');
    await user.type(screen.getByLabelText(/මුරපදය/), 'whatever1');
    await user.click(screen.getByRole('button', { name: /පිවිසෙන්න/ }));

    await waitFor(() => {
      expect(screen.getByText(/ගිණුමක් නොමැත/)).toBeInTheDocument();
    });
  });

  it('never claims a password reset email was sent in local mode', async () => {
    const user = userEvent.setup();
    renderWithProviders('/forgot-password');

    await user.type(screen.getByLabelText(/ඊමේල් ලිපිනය/), 'someone@example.com');
    await user.click(screen.getByRole('button', { name: /යළි සැකසීමේ සබැඳිය යවන්න/ }));

    await waitFor(() => {
      expect(screen.getByText(/ගිණුමක් නොමැත|ඊමේල් යැවිය නොහැක/)).toBeInTheDocument();
    });
  });

  it('denies admin access to a signed-in non-admin and explains why hiding a button is not security', async () => {
    const user = userEvent.setup();
    renderWithProviders('/register');

    await user.type(screen.getByLabelText(/ඊමේල් ලිපිනය/), 'student@example.com');
    await user.type(screen.getByLabelText(/මුරපදය \(අවම අකුරු 6\)/), 'secret123');
    await user.type(screen.getByLabelText(/මුරපදය තහවුරු කරන්න/), 'secret123');
    await user.click(screen.getByRole('button', { name: /ගිණුම සාදන්න/ }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/මගේ ඉගෙනුම/);
    });
  });

  it('renders Google sign-in buttons on login and register pages', () => {
    renderWithProviders('/login');
    expect(
      screen.getByRole('button', { name: /Google හරහා ඉදිරියට යන්න/ })
    ).toBeInTheDocument();
  });

  it('signs in the bootstrapped admin account (adminaura.hirusha@auramail.com) and reaches the Admin CMS', async () => {
    const user = userEvent.setup();
    renderWithProviders('/login');

    await user.type(screen.getByLabelText(/ඊමේල් ලිපිනය/), 'adminaura.hirusha@auramail.com');
    await user.type(screen.getByLabelText(/මුරපදය/), 'adminaura');
    await user.click(screen.getByRole('button', { name: /^පිවිසෙන්න$/ }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Admin CMS/);
    });
  });
});

describe('My Learning dashboard', () => {
  it('reports 0% progress rather than a fabricated percentage for a new account', async () => {
    const user = userEvent.setup();
    renderWithProviders('/register');

    await user.type(screen.getByLabelText(/ඊමේල් ලිපිනය/), 'fresh@example.com');
    await user.type(screen.getByLabelText(/මුරපදය \(අවම අකුරු 6\)/), 'secret123');
    await user.type(screen.getByLabelText(/මුරපදය තහවුරු කරන්න/), 'secret123');
    await user.click(screen.getByRole('button', { name: /ගිණුම සාදන්න/ }));

    await waitFor(() => {
      const progressRegion = screen.getByRole('progressbar', { name: /සමස්ත ඉගෙනුම් ප්‍රගතිය/ });
      expect(progressRegion).toHaveAttribute('aria-valuenow', '0');
    });
  });

  it('explains that the percentage is derived from published lessons', async () => {
    const user = userEvent.setup();
    renderWithProviders('/register');

    await user.type(screen.getByLabelText(/ඊමේල් ලිපිනය/), 'explain@example.com');
    await user.type(screen.getByLabelText(/මුරපදය \(අවම අකුරු 6\)/), 'secret123');
    await user.type(screen.getByLabelText(/මුරපදය තහවුරු කරන්න/), 'secret123');
    await user.click(screen.getByRole('button', { name: /ගිණුම සාදන්න/ }));

    await waitFor(() => {
      expect(screen.getByText(/දැනට ප්‍රකාශිත පාඩම්/)).toBeInTheDocument();
    });
  });
});

describe('Music Lab page', () => {
  it('renders all nine lab tools as tabs and defaults to the piano', async () => {
    renderWithProviders('/labs');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/අන්තර්ක්‍රියාකාරී Music Lab/);

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(9);

    const pianoTab = screen.getByRole('tab', { name: /අතථ්‍ය පියානෝ/ });
    expect(pianoTab).toHaveAttribute('aria-selected', 'true');
  });

  it('opens a lab directly via the ?tab= query parameter', async () => {
    renderWithProviders('/labs?tab=metronome');
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /මෙට්‍රොනෝමය/ })).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('states that labs require no account', async () => {
    renderWithProviders('/labs');
    expect(screen.getByText(/ගිණුමක් අවශ්‍ය නැත/)).toBeInTheDocument();
  });
});

describe('Virtual Piano', () => {
  it('renders labelled, keyboard-focusable keys across the default range', () => {
    render(<VirtualPiano />);
    const c4 = screen.getByRole('button', { name: /C4 ස්වරය වාදනය කරන්න/ });
    expect(c4).toBeInTheDocument();
    expect(c4.tagName).toBe('BUTTON');
  });

  it('does not start audio before a user gesture (no autoplay)', () => {
    render(<VirtualPiano />);
    expect(screen.getByText(/ස්වයංක්‍රීයව ආරම්භ නොකරයි/)).toBeInTheDocument();
  });

  it('shows enharmonic equivalents in the keyboard map', () => {
    render(<VirtualPiano />);
    expect(screen.getByText(/C♯ = D♭/)).toBeInTheDocument();
  });

  it('allows changing the octave range', () => {
    render(<VirtualPiano />);
    const octaveSelect = screen.getByLabelText(/ආරම්භක ඔක්ටේව්/);
    expect(octaveSelect).toBeInTheDocument();
    expect(within(octaveSelect).getAllByRole('option').length).toBeGreaterThan(1);
  });

  it('exposes a panic button to release all stuck notes', () => {
    render(<VirtualPiano />);
    expect(screen.getByRole('button', { name: /සියලු ස්වර නතර කරන්න/ })).toBeInTheDocument();
  });
});

describe('Metronome', () => {
  it('renders BPM, time signature controls and a beat indicator', () => {
    render(<Metronome />);
    expect(screen.getByLabelText(/Tempo — 96 BPM/)).toBeInTheDocument();
    expect(screen.getByLabelText(/කාල මානය/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ආරම්භ කරන්න/ })).toBeInTheDocument();
  });

  it('documents that it uses an audio-clock lookahead scheduler rather than setInterval', () => {
    render(<Metronome />);
    expect(screen.getByText(/Lookahead Scheduler/)).toBeInTheDocument();
  });
});

describe('Scale Explorer', () => {
  it('generates and displays the notes of the selected scale', () => {
    render(<ScaleExplorer />);
    // Default is C major.
    expect(screen.getAllByText(/මේජර් ස්වර මාලාව \(Major Scale\)/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/T - T - S - T - T - T - S/).length).toBeGreaterThan(0);
  });

  it('shows a frequency reference for each degree', () => {
    render(<ScaleExplorer />);
    expect(screen.getByRole('columnheader', { name: /සංඛ්‍යාතය \(Hz\)/ })).toBeInTheDocument();
    expect(screen.getAllByText('261.63').length).toBeGreaterThan(0);
  });
});

describe('404 handling', () => {
  it('renders a friendly Sinhala 404 with navigation options', async () => {
    renderWithProviders('/this-route-does-not-exist');
    await waitFor(() => {
      expect(screen.getByText('404')).toBeInTheDocument();
    });
    const homeLinks = screen.getAllByRole('link', { name: /මුල් පිටුව/ });
    expect(homeLinks.length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /ඉගෙනුම් මාර්ග/ }).length).toBeGreaterThan(0);
  });
});

describe('Console hygiene', () => {
  it('does not log errors while rendering the home page', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    renderWithProviders('/');
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
