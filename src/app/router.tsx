import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import Home from '@/pages/Home';
import Mission from '@/pages/Mission';
import Eglises from '@/pages/Eglises';
import Education from '@/pages/Education';
import CentreFormation from '@/pages/CentreFormation';
import Medical from '@/pages/Medical';
import Actualites from '@/pages/Actualites';
import Contact from '@/pages/Contact';
import Soutenir from '@/pages/Soutenir';
import MaintenancePage from '@/pages/Maintenancepage';
import InscriptionInstitutBibliquePage from '@/pages/InscriptionInstitutBibliquePage';
import InscriptionFathetPage from '@/pages/InscriptionFathetPage';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../features/auth/ResetPasswordPage';
import { ChangePasswordPage } from '../features/auth/ChangePasswordPage';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { RequireAuthOnly } from '../auth/RequireAuthOnly';
import { AdminLayout } from '../shared/layouts/AdminLayout';
import { StudentLayout } from '../shared/layouts/StudentLayout';
import { ProgramsPage } from '../features/admin/programs/ProgramsPage';
import { AcademicYearsPage } from '../features/admin/academic-years/AcademicYearsPage';
import { SubjectsPage } from '../features/admin/subjects/SubjectsPage';
import { ContentItemsPage } from '../features/admin/content-items/ContentItemsPage';
import { EnrollmentsPage } from '../features/admin/enrollments/EnrollmentsPage';
import { StudentsPage } from '../features/admin/students/StudentsPage';
import ContentPreviewPage from '../features/admin/content-items/ContentPreviewPage';
import SubjectContentPage from '../shared/features/student/pages/SubjectContentPage';
import { StudentDashboardPage } from '../features/student/pages/StudentDashboardPage';
import { EnrollInfoPage } from '../features/student/pages/EnrollInfoPage';
import { FakePaymentPage } from '../features/admin/students/FakePaymentPage';
import { PaymentsValidationPage } from '../features/admin/payments/PaymentsValidationPage';
import { MyCoursesPage } from '../features/student/pages/MyCoursesPage';
import { ProfilePage } from '../features/student/profile/ProfilePage';
import { GroupResourcesPage } from '../shared/group-resources/GroupResourcesPage';
import { GroupResourcesPickerPage } from '../features/admin/group-resources/GroupResourcesPickerPage';
import { NotFoundPage } from '../shared/pages/NotFoundPage';
import { NotesTestPage } from '../shared/features/notepad/NotesTestPage';
import { InquiriesListPage } from '../features/admin/inquiery/InquiriesListPage';
import { InquiryDetailPage } from '../features/admin/inquiery/InquiryDetailPage';
import { StudentYearPage } from '../features/student/pages/StudentYearPage';
import RootLayout from '@/components/layout/RootLayout'; // ← AJOUTer pour le scroll top des pages 


// Lazy load de la page Formation : elle embarque Swiper.js (carrousel 3D),
// une librairie tierce lourde utilisée uniquement sur cette page.
// Ça évite que son poids pèse sur les autres routes et isole son
// chargement au moment réel où l'utilisateur visite /formation.
const Formation = lazy(() => import('@/pages/Formation'));

// Fallback léger affiché pendant le téléchargement du chunk Formation
const FormationFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

function UnauthorizedPage() {
  return <div>Action non autorisée.</div>;
}
const router = createBrowserRouter([
  {
    element: <RootLayout />,        // ← ENVELOPPE TOUT
    children: [
      // ── Pages publiques ──
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/mission', element: <Mission /> },
          { path: '/eglises', element: <Eglises /> },
          {
            path: '/formation',
            element: (
              <Suspense fallback={<FormationFallback />}>
                <Formation />
              </Suspense>
            ),
          },
          { path: '/education', element: <Education /> },
          { path: '/centre-de-formation', element: <CentreFormation /> },
          { path: '/medical', element: <Medical /> },
          { path: '/actualites', element: <Actualites /> },
          { path: '/contact', element: <Contact /> },
          { path: '/soutenir', element: <Soutenir /> },
          { path: '/maintenance', element: <MaintenancePage /> },
          { path: '/inscription/institut-biblique', element: <InscriptionInstitutBibliquePage /> },
          { path: '/inscription/fathet', element: <InscriptionFathetPage /> },
        ],
      },

  // ── Pages d'authentification (layout propre, sans Navbar publique) ─
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },

  // ── Route protégée minimale : juste "être connecté" ───────────────
  {
    element: <RequireAuthOnly />,
    errorElement: <NotFoundPage />,
    children: [
      { path: '/change-password', element: <ChangePasswordPage /> },
      { path: '/notes-test', element: <NotesTestPage /> }, // ← temporaire, à retirer une fois le widget flottant prêt

    ],
  },

  // ── Routes STUDENT ────────────────────────────────────────────────
  {
    element: <ProtectedRoute requiredRole="STUDENT" />,
    errorElement: <NotFoundPage />,
    children: [
      { path: '/content/:contentItemId', element: <SubjectContentPage /> },
      { path: '/fake-payment/:transactionId', element: <FakePaymentPage /> },

      {
        element: <StudentLayout />,
        children: [
          { path: '/student', element: <StudentDashboardPage /> },
          { path: '/student/my-courses', element: <MyCoursesPage /> },
          { path: '/student/enroll/:yearId', element: <EnrollInfoPage /> },
          { path: '/student/profile', element: <ProfilePage /> },
          { path: '/student/group-resources/:yearId', element: <GroupResourcesPage /> },
          { path: '/student/years/:yearId', element: <StudentYearPage /> },
          
        ],
      },
    ],
  },

  // ── Routes ADMIN / TEACHER ────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            element: <ProtectedRoute requiredPermission="program.manage" />,
            children: [
              { path: '/admin/programs', element: <ProgramsPage /> },
              { path: '/admin/subjects', element: <SubjectsPage /> },
            ],
          },
          {
            // TEACHER accède ici via 'academic_year.view' (lecture seule),
            // ADMIN/SUPER_ADMIN via 'program.manage' (gestion complète).
            element: <ProtectedRoute requiredPermission={['program.manage', 'academic_year.view']} />,
            children: [
              { path: '/admin/academic-years', element: <AcademicYearsPage /> },
            ],
          },
          {
            element: <ProtectedRoute requiredPermission="content.manage" />,
            children: [
              { path: '/admin/content-items', element: <ContentItemsPage /> },
              { path: '/admin/content-items/:contentItemId/preview', element: <ContentPreviewPage /> },
            ],
          },
          {
            element: <ProtectedRoute requiredPermission="student.manage" />,
            children: [
              { path: '/admin/grant-manual', element: <EnrollmentsPage /> },
              { path: '/admin/students', element: <StudentsPage /> },
              { path: '/admin/payments', element: <PaymentsValidationPage /> },
              { path: '/admin/group-resources', element: <GroupResourcesPickerPage /> },
              { path: '/admin/group-resources/:yearId', element: <GroupResourcesPage /> },
              { path: '/admin/inquiries', element: <InquiriesListPage /> },
              { path: '/admin/inquiries/:id', element: <InquiryDetailPage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}