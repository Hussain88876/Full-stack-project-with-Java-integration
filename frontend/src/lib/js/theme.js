import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initialize theme from localStorage or default to 'dark'
const storedTheme = browser ? localStorage.getItem('theme') || 'dark' : 'dark';

export const theme = writable(storedTheme);

// Subscribe to theme changes and update localStorage + DOM
if (browser) {
    theme.subscribe(value => {
        localStorage.setItem('theme', value);
        document.documentElement.setAttribute('data-theme', value);
    });

    // Set initial theme on page load
    document.documentElement.setAttribute('data-theme', storedTheme);
}

export function toggleTheme() {
    theme.update(current => current === 'light' ? 'dark' : 'light');
}
