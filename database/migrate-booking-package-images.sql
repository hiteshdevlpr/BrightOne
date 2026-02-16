-- Update package carousel images to use local assets from /assets/img/booking/
-- Run this on existing databases so booking page uses images from that folder.
-- New installs get these paths from init.sql already.

UPDATE packages SET images = ARRAY[
    '/assets/img/booking/essential-1.jpg',
    '/assets/img/booking/essential-2.jpg',
    '/assets/img/booking/essential-3.jpg'
] WHERE code = 'essential';

UPDATE packages SET images = ARRAY[
    '/assets/img/booking/premium-1.jpg',
    '/assets/img/booking/premium-2.jpg',
    '/assets/img/booking/premium-3.jpg'
] WHERE code = 'premium';

UPDATE packages SET images = ARRAY[
    '/assets/img/booking/luxury-1.jpg',
    '/assets/img/booking/luxury-2.jpg',
    '/assets/img/booking/luxury-3.jpg'
] WHERE code = 'luxury';

UPDATE packages SET images = ARRAY[
    '/assets/img/booking/growth-1.jpg',
    '/assets/img/booking/growth-2.jpg',
    '/assets/img/booking/growth-3.jpg'
] WHERE code = 'growth';

UPDATE packages SET images = ARRAY[
    '/assets/img/booking/accelerator-1.jpg',
    '/assets/img/booking/accelerator-2.jpg',
    '/assets/img/booking/accelerator-3.jpg'
] WHERE code = 'accelerator';

UPDATE packages SET images = ARRAY[
    '/assets/img/booking/tailored-1.jpg',
    '/assets/img/booking/tailored-2.jpg'
] WHERE code = 'tailored';
