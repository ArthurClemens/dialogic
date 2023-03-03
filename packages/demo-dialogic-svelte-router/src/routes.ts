import HomePage from './pages/HomePage.svelte';
import ProfilePage from './pages/ProfilePage.svelte';

export default {
  '/': HomePage,
  '/profile/:edit?': ProfilePage,
};
