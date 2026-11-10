// Default settings. Admin dashboard se jo save hoga woh in par override ho jayega.
// Koi phone/address/dish jaisi cheez yahan nahi rakhi - woh admin se aayegi.
export const DEFAULT_SETTINGS = {
  mode: 'construction', // 'live' | 'construction'
  brand: {
    name: 'Farm House',
    subtitle: 'Bradford · Restaurant',
    fullName: 'Farm House Bradford Restaurant',
    logoUrl: '',
    showText: true,
  },
  theme: {
    primary: '#9E2B25',
    secondary: '#4F6B3A',
    accent: '#C9962F',
    background: '#F7F0E1',
    text: '#3B2A1E',
  },
  construction: {
    tag: 'Under construction',
    headline: 'Our website is coming soon.',
    text: 'Farm House Bradford Restaurant is getting its website ready. Please check back soon.',
  },
  header: {
    nav: [
      { label: 'Home', path: '/', visible: true },
      { label: 'About Us', path: '/about', visible: true },
      { label: 'Menu', path: '/menu', visible: true },
      { label: 'Gallery', path: '/gallery', visible: true },
      { label: 'Booking', path: '/booking', visible: true },
      { label: 'Franchise', path: '/franchise', visible: true },
      { label: 'Contact Us', path: '/contact', visible: true },
      { label: 'Blog', path: '/blog', visible: false },
    ],
    cta: { show: false, label: 'Book a table', path: '/booking' },
  },
  footer: {
    about: '',
    copyright: '© Farm House Bradford Restaurant',
    showContact: true,
    links: [],
    social: { facebook: '', instagram: '', tiktok: '', x: '', youtube: '' },
  },
  contact: { phone: '', email: '', address: '', hours: '', mapUrl: '' },
  seo: { title: '', description: '' },
  pages: {
    home: {
      heroTitle: '',
      heroText: '',
      heroImage: '',
      heroButtonLabel: '',
      heroButtonPath: '/menu',
      aboutTitle: '',
      aboutText: '',
      aboutImage: '',
      showMenuPreview: true,
      showGalleryPreview: true,
      showBlogPreview: true,
    },
    about: { title: 'About Us', body: '', image: '' },
    menu: { title: 'Our Menu', intro: '', note: '' },
    gallery: { title: 'Gallery', intro: '' },
    booking: {
      title: 'Book a Table',
      intro: '',
      enabled: true,
      successMessage: 'Thank you! We have received your request and will contact you soon.',
    },
    franchise: { title: 'Franchise', intro: '', body: '', image: '' },
    contact: { title: 'Contact Us', intro: '' },
    blog: { title: 'Blog', intro: '' },
  },
};
