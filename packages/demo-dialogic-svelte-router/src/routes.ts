import HomePage from './HomePage.svelte';
import ProfilePage from './ProfilePage.svelte';

export default {
  '/': HomePage,
  '/profile/:edit?': ProfilePage,
};
