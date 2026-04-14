import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import WhatsAppButton from '@/components/WhatsAppButton';
import AccessibilityControls from '@/components/common/AccessibilityControls';
import AdminLayout from '@/components/auth/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import FAQ from './pages/FAQ';
import Services from './pages/Services';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Destinations from './pages/Destinations';
import Safaris from './pages/Safaris';
import Booking from './pages/Booking';
import NotFound from './pages/NotFound';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminDashboardPage from './pages/admin/AdminDashboard';
import AdminContentPage from './pages/admin/AdminContent';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage';
import AdminLoginPage from './pages/admin/AdminLogin';
import AdminOperationsLayout from './pages/admin/AdminOperationsLayout';

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const isStaffRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff');

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/services" element={<Services />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:country" element={<Destinations />} />
        <Route path="/destinations/:country/:destination" element={<Destinations />} />
        <Route path="/safaris" element={<Safaris />} />
        <Route path="/safaris/:id" element={<Safaris />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/staff/login" element={<AdminLoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="operations" element={<AdminOperationsLayout />}>
              <Route index element={<Navigate to="bookings" replace />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="inquiries" element={<AdminInquiriesPage />} />
            </Route>
            <Route path="content" element={<AdminContentPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isStaffRoute && (
        <>
          <AccessibilityControls />
          <WhatsAppButton />
        </>
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
