// Centralized booking logic hook
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { ServiceCategory as CategoryType } from '@/types/booking';
import type {
    PackageClient,
    AddOnClient,
    PropertySizeConfig,
    PartnerCode,
} from '@/types/services';
import {
    getPackages,
    getAddons,
    getPropertySizeConfigs,
    validatePartnerCode,
} from '@/lib/services-api';
import {
    getPackagePriceWithPartner,
    getAddonPriceWithPartner,
    calculateBookingTotal,
    resolveVirtualStagingAddons,
    getAvailableAddons,
    formatPhoneNumber,
    shouldShowContactPrice,
} from '@/lib/booking-utils';
import { handleBookingSubmission } from '@/components/booking/booking-form-handler';
import { getRecaptchaToken } from '@/lib/recaptcha-client';
import { validateBookingForm, validateEmail, validatePhone, HONEYPOT_FIELD } from '@/lib/validation';

const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-places-script-booking';

function loadGoogleMapsPlaces(apiKey: string): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    const existing = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
    if (existing) return Promise.resolve();
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = GOOGLE_MAPS_SCRIPT_ID;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Google Maps script failed to load'));
        document.head.appendChild(script);
    });
}

declare global {
    interface Window {
        google?: {
            maps: {
                places: {
                    Autocomplete: new (
                        input: HTMLInputElement,
                        opts?: {
                            types?: string[];
                            componentRestrictions?: { country: string | string[] };
                            fields?: string[];
                        }
                    ) => {
                        addListener: (event: string, fn: () => void) => { remove: () => void };
                        getPlace: () => { formatted_address?: string };
                    };
                };
                event: { removeListener: (listener: { remove: () => void }) => void };
            };
        };
    }
}

interface UseBookingLogicOptions {
    defaultCategory?: CategoryType;
    onSubmitted?: () => void;
}

interface UseBookingLogicReturn {
    // State
    selectedCategory: CategoryType;
    propertyAddressInput: string;
    appliedPropertyAddress: string;
    propertySuiteInput: string;
    appliedPropertySuite: string;
    propertySizeInput: string;
    appliedPropertySize: string;
    selectedPackageId: string | null;
    selectedAddOns: string[];
    virtualStagingPhotoCount: number;
    preferredPartnerCodeInput: string;
    appliedPartnerCode: string;
    partnerCodeError: string;
    showPartnerCodePopup: boolean;
    partnerCodePopupInput: string;
    partnerCodePopupError: string;
    formData: {
        name: string;
        email: string;
        phone: string;
        preferredDate: string;
        preferredTime: string;
        message: string;
        paymentIntentId?: string;
        [HONEYPOT_FIELD]: string;
    };
    isSubmitting: boolean;
    isSubmitted: boolean;
    formErrors: string[];
    fieldErrors: { [key: string]: string };
    openAccordion: string | null;
    enterManuallyListing: boolean;
    placesReadyListing: boolean;

    // Data
    packages: PackageClient[];
    addons: AddOnClient[];
    propertySizeConfigs: PropertySizeConfig[];
    partnerCodeData: PartnerCode | null;
    isLoading: boolean;

    // Computed
    availableAddOns: AddOnClient[];
    includedInSelectedPackage: string[];
    resolvedSelectedAddOns: string[];
    canCompleteBooking: boolean;
    step1Filled: boolean;

    // Actions
    setSelectedCategory: (category: CategoryType) => void;
    setPropertyAddressInput: (value: string) => void;
    setAppliedPropertyAddress: (value: string) => void;
    setPropertySuiteInput: (value: string) => void;
    setAppliedPropertySuite: (value: string) => void;
    setPropertySizeInput: (value: string) => void;
    setAppliedPropertySize: (value: string) => void;
    setSelectedPackageId: (id: string | null) => void;
    setSelectedAddOns: (ids: string[] | ((prev: string[]) => string[])) => void;
    setVirtualStagingPhotoCount: (count: number) => void;
    setPreferredPartnerCodeInput: (value: string) => void;
    setAppliedPartnerCode: (value: string) => void;
    setPartnerCodeError: (error: string) => void;
    setShowPartnerCodePopup: (show: boolean) => void;
    setPartnerCodePopupInput: (value: string) => void;
    setPartnerCodePopupError: (error: string) => void;
    setFormData: (data: any) => void;
    setIsSubmitting: (submitting: boolean) => void;
    setIsSubmitted: (submitted: boolean) => void;
    setFormErrors: (errors: string[]) => void;
    setFieldErrors: (errors: any) => void;
    setOpenAccordion: (id: string | null) => void;
    setEnterManuallyListing: (manual: boolean) => void;
    setPlacesReadyListing: (ready: boolean) => void;

    // Functions
    getPackagePrice: (basePrice: number, packageId: string) => number | null;
    getAddonPrice: (addonId: string) => number;
    calculateTotal: () => number;
    handlePackageClick: (pkgId: string) => void;
    handleAddOnToggle: (addOnId: string) => void;
    handleApplyPartnerCode: () => void;
    handleApplyPartnerCodeFromPopup: () => void;
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleEmailBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    handlePhoneBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    handleFormSubmit: (e?: React.FormEvent, overrideData?: Record<string, any>) => Promise<void>;
    formatPrice: (price: number) => string;
    propertyAddressInputRef: React.RefObject<HTMLInputElement | null>;
    autocompleteListenerRef: React.MutableRefObject<{ remove: () => void } | null>;
}

export function useBookingLogic(options: UseBookingLogicOptions = {}): UseBookingLogicReturn {
    const { defaultCategory, onSubmitted } = options;

    // State
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>(defaultCategory ?? null);
    const [propertyAddressInput, setPropertyAddressInput] = useState('');
    const [appliedPropertyAddress, setAppliedPropertyAddress] = useState('');
    const [propertySuiteInput, setPropertySuiteInput] = useState('');
    const [appliedPropertySuite, setAppliedPropertySuite] = useState('');
    const [propertySizeInput, setPropertySizeInput] = useState('');
    const [appliedPropertySize, setAppliedPropertySize] = useState('');
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
    const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
    const [virtualStagingPhotoCount, setVirtualStagingPhotoCount] = useState(1);
    const [preferredPartnerCodeInput, setPreferredPartnerCodeInput] = useState('');
    const [appliedPartnerCode, setAppliedPartnerCode] = useState('');
    const [partnerCodeError, setPartnerCodeError] = useState('');
    const [showPartnerCodePopup, setShowPartnerCodePopup] = useState(false);
    const [partnerCodePopupInput, setPartnerCodePopupInput] = useState('');
    const [partnerCodePopupError, setPartnerCodePopupError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        message: '',
        paymentIntentId: '',
        [HONEYPOT_FIELD]: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const [enterManuallyListing, setEnterManuallyListing] = useState(false);
    const [placesReadyListing, setPlacesReadyListing] = useState(false);

    // Data from API
    const [packages, setPackages] = useState<PackageClient[]>([]);
    const [addons, setAddons] = useState<AddOnClient[]>([]);
    const [propertySizeConfigs, setPropertySizeConfigs] = useState<PropertySizeConfig[]>([]);
    const [partnerCodeData, setPartnerCodeData] = useState<PartnerCode | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Refs
    const propertyAddressInputRef = useRef<HTMLInputElement>(null);
    const autocompleteListenerRef = useRef<{ remove: () => void } | null>(null);

    // Fetch services data
    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const [packagesData, addonsData, sizeConfigs] = await Promise.all([
                    getPackages(selectedCategory || undefined),
                    getAddons(selectedCategory || undefined),
                    getPropertySizeConfigs(),
                ]);
                setPackages(packagesData);
                setAddons(addonsData);
                setPropertySizeConfigs(sizeConfigs);
            } catch (error) {
                console.error('Failed to fetch services data:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [selectedCategory]);

    // Fetch partner code data when applied
    useEffect(() => {
        async function fetchPartnerCode() {
            if (!appliedPartnerCode) {
                setPartnerCodeData(null);
                return;
            }
            try {
                const result = await validatePartnerCode(appliedPartnerCode);
                setPartnerCodeData(result.valid ? result.partnerCode || null : null);
            } catch (error) {
                console.error('Failed to validate partner code:', error);
                setPartnerCodeData(null);
            }
        }
        fetchPartnerCode();
    }, [appliedPartnerCode]);

    // Get included addon IDs for selected package
    const includedInSelectedPackage = useMemo(() => {
        if (!selectedPackageId || selectedCategory !== 'listing') return [];
        // This should come from database - for now using fallback
        // TODO: Fetch from API endpoint that returns package included addons
        const packageInclusions: Record<string, string[]> = {
            essential: ['listing_website'],
            premium: ['drone_photos', 'drone_video', 'twilight_photos', 'floor_plan', 'listing_website', 'cinematic_video', 'social_reel'],
            luxury: ['drone_photos', 'drone_video', 'twilight_photos', 'virtual_tour', 'floor_plan', 'cinematic_video', 'agent_walkthrough', 'social_reel', 'listing_website'],
        };
        return packageInclusions[selectedPackageId] || [];
    }, [selectedPackageId, selectedCategory]);

    // Available addons (filtered by package inclusions)
    const availableAddOns = useMemo(() => {
        return getAvailableAddons(addons, includedInSelectedPackage);
    }, [addons, includedInSelectedPackage]);

    // Remove included addons when package is selected
    useEffect(() => {
        if (selectedCategory !== 'listing' || !selectedPackageId || includedInSelectedPackage.length === 0) return;
        setSelectedAddOns((prev) => prev.filter((id) => !includedInSelectedPackage.includes(id)));
    }, [selectedCategory, selectedPackageId, includedInSelectedPackage]);

    // Resolved selected addons (virtual staging expanded)
    const resolvedSelectedAddOns = useMemo(() => {
        return resolveVirtualStagingAddons(selectedAddOns, virtualStagingPhotoCount);
    }, [selectedAddOns, virtualStagingPhotoCount]);

    // Google Maps integration
    const googleMapsApiKey = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY : '';
    useEffect(() => {
        if (selectedCategory !== 'listing' || !googleMapsApiKey || typeof window === 'undefined') return;
        loadGoogleMapsPlaces(googleMapsApiKey)
            .then(() => setPlacesReadyListing(true))
            .catch(() => { });
    }, [selectedCategory, googleMapsApiKey]);

    useEffect(() => {
        if (
            selectedCategory !== 'listing' ||
            !placesReadyListing ||
            enterManuallyListing ||
            openAccordion !== 'property' ||
            !propertyAddressInputRef.current ||
            !window.google?.maps?.places
        )
            return;

        const input = propertyAddressInputRef.current;
        const Autocomplete = window.google.maps.places.Autocomplete;
        const autocomplete = new Autocomplete(input, {
            types: ['address'],
            componentRestrictions: { country: 'ca' },
            fields: ['formatted_address'],
        });

        const listener = autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
                setPropertyAddressInput(place.formatted_address);
            }
        });

        autocompleteListenerRef.current = listener;

        return () => {
            if (autocompleteListenerRef.current) {
                autocompleteListenerRef.current.remove();
                autocompleteListenerRef.current = null;
            }
        };
    }, [selectedCategory, placesReadyListing, enterManuallyListing, openAccordion]);

    // Pricing functions
    const getPackagePrice = useCallback(
        (basePrice: number, packageId: string): number | null => {
            if (selectedCategory === 'personal') {
                if (packageId === 'tailored') return null;
                const { price } = getPackagePriceWithPartner(
                    basePrice,
                    undefined,
                    packageId,
                    appliedPartnerCode || null,
                    partnerCodeData,
                    propertySizeConfigs
                );
                return price;
            }
            if (selectedCategory !== 'listing') return basePrice;
            const sqft = appliedPropertySize.trim() ? parseInt(appliedPropertySize, 10) : NaN;
            if (!isNaN(sqft) && sqft >= 5000) {
                return null; // Show "Contact for Price"
            }
            const { price } = getPackagePriceWithPartner(
                basePrice,
                appliedPropertySize.trim() || undefined,
                packageId,
                appliedPartnerCode || null,
                partnerCodeData,
                propertySizeConfigs
            );
            return price;
        },
        [selectedCategory, appliedPropertySize, appliedPartnerCode, partnerCodeData, propertySizeConfigs]
    );

    const getAddonPrice = useCallback(
        (addonId: string): number => {
            const addon = addons.find((a) => a.id === addonId);
            if (!addon) return 0;

            const hasPackageSelected = !!selectedPackageId && selectedCategory === 'listing';
            if (addonId === 'virtual_staging') {
                const pricePerPhoto = getAddonPriceWithPartner(
                    addon,
                    hasPackageSelected,
                    appliedPartnerCode || null,
                    partnerCodeData
                );
                return pricePerPhoto * virtualStagingPhotoCount;
            } else if (addonId.startsWith('virtual_staging_')) {
                const n = parseInt(addonId.split('_')[2], 10) || 1;
                const pricePerPhoto = getAddonPriceWithPartner(
                    addon,
                    hasPackageSelected,
                    appliedPartnerCode || null,
                    partnerCodeData
                );
                return pricePerPhoto * n;
            } else {
                return getAddonPriceWithPartner(
                    addon,
                    hasPackageSelected,
                    appliedPartnerCode || null,
                    partnerCodeData
                );
            }
        },
        [addons, selectedPackageId, selectedCategory, appliedPartnerCode, partnerCodeData, virtualStagingPhotoCount]
    );

    const calculateTotal = useCallback((): number => {
        const pkg = packages.find((p) => p.id === selectedPackageId);
        const pkgPrice = pkg ? getPackagePrice(pkg.basePrice, pkg.id) : null;
        const addonPrices = selectedAddOns.map((id) => getAddonPrice(id));
        return calculateBookingTotal(pkgPrice, addonPrices);
    }, [packages, selectedPackageId, selectedAddOns, getPackagePrice, getAddonPrice]);

    // Validation
    const canCompleteBooking = useMemo(() => {
        return selectedPackageId !== null || selectedAddOns.length > 0;
    }, [selectedPackageId, selectedAddOns]);

    const step1Filled = useMemo(() => {
        return selectedCategory !== 'listing'
            ? true
            : propertyAddressInput.trim() !== '' && propertySizeInput.trim() !== '';
    }, [selectedCategory, propertyAddressInput, propertySizeInput]);

    // Actions
    const handlePackageClick = useCallback((pkgId: string) => {
        setSelectedPackageId((prev) => (prev === pkgId ? null : pkgId));
    }, []);

    const handleAddOnToggle = useCallback((addOnId: string) => {
        setSelectedAddOns((prev) => {
            if (prev.includes(addOnId)) {
                return prev.filter((id) => id !== addOnId);
            } else {
                return [...prev, addOnId];
            }
        });
    }, []);

    const handleApplyPartnerCode = useCallback(() => {
        const code = preferredPartnerCodeInput.trim();
        if (!code) {
            setAppliedPartnerCode('');
            setPartnerCodeError('');
            return;
        }
        validatePartnerCode(code)
            .then((result) => {
                if (result.valid) {
                    setAppliedPartnerCode(code);
                    setPartnerCodeError('');
                } else {
                    setAppliedPartnerCode('');
                    setPartnerCodeError('Invalid partner code');
                }
            })
            .catch(() => {
                setAppliedPartnerCode('');
                setPartnerCodeError('Invalid partner code');
            });
    }, [preferredPartnerCodeInput]);

    const handleApplyPartnerCodeFromPopup = useCallback(() => {
        const code = partnerCodePopupInput.trim();
        if (!code) {
            setPartnerCodePopupError('Please enter a partner code');
            return;
        }
        validatePartnerCode(code)
            .then((result) => {
                if (result.valid) {
                    setAppliedPartnerCode(code);
                    setPreferredPartnerCodeInput(code);
                    setPartnerCodeError('');
                    setShowPartnerCodePopup(false);
                } else {
                    setPartnerCodePopupError('Invalid partner code');
                }
            })
            .catch(() => {
                setPartnerCodePopupError('Invalid partner code');
            });
    }, [partnerCodePopupInput]);

    const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
    }, [fieldErrors]);

    const handleEmailBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const err = validateEmail(e.target.value);
        setFieldErrors((prev) => (err ? { ...prev, email: err } : { ...prev, email: '' }));
    }, []);

    const handlePhoneBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const trimmed = e.target.value?.trim() ?? '';
        if (!trimmed) {
            setFieldErrors((prev) => ({ ...prev, phone: '' }));
            return;
        }
        const digits = trimmed.replace(/\D/g, '');
        const formatted = digits.length >= 10 && digits.length <= 11 ? formatPhoneNumber(trimmed) : trimmed;
        if (formatted !== trimmed) {
            setFormData((prev) => ({ ...prev, phone: formatted }));
        }
        const err = validatePhone(formatted);
        setFieldErrors((prev) => (err ? { ...prev, phone: err } : { ...prev, phone: '' }));
    }, []);

    const handleFormSubmit = useCallback(
        async (e?: React.FormEvent, overrideData?: Record<string, any>) => {
            if (e) e.preventDefault();

            const effectiveFormData = { ...formData, ...overrideData };

            const effectivePropertyAddress = overrideData?.propertyAddress || appliedPropertyAddress;
            const effectiveUnitNumber = overrideData?.unitNumber || appliedPropertySuite;
            const effectivePropertySize = overrideData?.propertySize || appliedPropertySize;

            if (!selectedPackageId && selectedAddOns.length === 0) {
                setFormErrors(['Please select a package or at least one add-on to continue']);
                return;
            }
            if (selectedCategory === 'listing' && !effectivePropertyAddress.trim()) {
                setFormErrors(['Please enter the property address in Step 1.']);
                return;
            }

            const pkg = packages.find((p) => p.id === selectedPackageId);
            const pkgPrice = pkg ? getPackagePrice(pkg.basePrice, pkg.id) : null;
            const addonsTotal = selectedAddOns.reduce((sum, id) => sum + getAddonPrice(id), 0);
            const subtotal = (pkgPrice ?? 0) + addonsTotal;
            const totalPrice = (subtotal * 1.13).toFixed(2);

            const propertyAddress =
                selectedCategory === 'personal'
                    ? effectiveFormData.message
                        ? 'See message'
                        : 'To be confirmed'
                    : effectivePropertyAddress || 'Address to be provided';
            const serviceType = selectedCategory === 'personal' ? 'Personal Branding' : 'Real Estate Media';

            const payloadForValidation = {
                name: effectiveFormData.name,
                email: effectiveFormData.email,
                phone: effectiveFormData.phone,
                serviceType,
                propertyAddress,
                serviceTier: selectedPackageId || undefined,
            };

            const validationErrors = validateBookingForm(payloadForValidation);
            if (validationErrors.length > 0) {
                setFormErrors(validationErrors.map((err) => err.message));
                const byField = validationErrors.reduce<{ [key: string]: string }>((acc, err) => {
                    acc[err.field] = err.message;
                    return acc;
                }, {});
                setFieldErrors(byField);
                return;
            }

            setFormErrors([]);
            setFieldErrors({});

            let recaptchaToken = '';
            try {
                recaptchaToken = await getRecaptchaToken('booking');
            } catch (err) {
                console.error('reCAPTCHA error:', err);
                setFormErrors(['Security check failed. Please refresh and try again.']);
                return;
            }

            const honeypotValue = effectiveFormData[HONEYPOT_FIELD as keyof typeof effectiveFormData];
            const websiteUrl = typeof honeypotValue === 'string' ? honeypotValue : '';

            const payload = {
                name: effectiveFormData.name,
                email: effectiveFormData.email,
                phone: effectiveFormData.phone,
                serviceType,
                propertyAddress,
                unitNumber: selectedCategory === 'listing' && effectiveUnitNumber ? effectiveUnitNumber : undefined,
                propertySize: selectedCategory === 'listing' ? effectivePropertySize : undefined,
                serviceTier: selectedPackageId || undefined,
                selectedAddOns: resolvedSelectedAddOns,
                preferredPartnerCode: appliedPartnerCode || undefined,
                preferredDate: effectiveFormData.preferredDate || undefined,
                preferredTime: effectiveFormData.preferredTime || undefined,
                message: effectiveFormData.message || undefined,
                totalPrice,
                paymentIntentId: effectiveFormData.paymentIntentId,
                recaptchaToken,
                website_url: websiteUrl,
            };

            await handleBookingSubmission(payload, setIsSubmitting, setIsSubmitted, setFormErrors);
            if (onSubmitted) {
                onSubmitted();
            }
        },
        [
            selectedPackageId,
            selectedAddOns,
            selectedCategory,
            appliedPropertyAddress,
            packages,
            getPackagePrice,
            getAddonPrice,
            formData,
            resolvedSelectedAddOns,
            appliedPartnerCode,
            appliedPropertySuite,
            appliedPropertySize,
            onSubmitted,
        ]
    );

    const formatPrice = useCallback((price: number): string => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
            minimumFractionDigits: 0,
        }).format(price);
    }, []);

    return {
        // State
        selectedCategory,
        propertyAddressInput,
        appliedPropertyAddress,
        propertySuiteInput,
        appliedPropertySuite,
        propertySizeInput,
        appliedPropertySize,
        selectedPackageId,
        selectedAddOns,
        virtualStagingPhotoCount,
        preferredPartnerCodeInput,
        appliedPartnerCode,
        partnerCodeError,
        showPartnerCodePopup,
        partnerCodePopupInput,
        partnerCodePopupError,
        formData,
        isSubmitting,
        isSubmitted,
        formErrors,
        fieldErrors,
        openAccordion,
        enterManuallyListing,
        placesReadyListing,

        // Data
        packages,
        addons,
        propertySizeConfigs,
        partnerCodeData,
        isLoading,

        // Computed
        availableAddOns,
        includedInSelectedPackage,
        resolvedSelectedAddOns,
        canCompleteBooking,
        step1Filled,

        // Actions
        setSelectedCategory,
        setPropertyAddressInput,
        setAppliedPropertyAddress,
        setPropertySuiteInput,
        setAppliedPropertySuite,
        setPropertySizeInput,
        setAppliedPropertySize,
        setSelectedPackageId,
        setVirtualStagingPhotoCount,
        setPreferredPartnerCodeInput,
        setPartnerCodeError,
        setShowPartnerCodePopup,
        setPartnerCodePopupInput,
        setPartnerCodePopupError,
        setFormData,
        setIsSubmitting,
        setIsSubmitted,
        setFormErrors,
        setFieldErrors,
        setOpenAccordion,
        setEnterManuallyListing,
        setPlacesReadyListing,

        // Functions
        getPackagePrice,
        getAddonPrice,
        calculateTotal,
        handlePackageClick,
        handleAddOnToggle,
        handleApplyPartnerCode,
        handleApplyPartnerCodeFromPopup,
        handleFormChange,
        handleEmailBlur,
        handlePhoneBlur,
        handleFormSubmit,
        formatPrice,
        propertyAddressInputRef,
        autocompleteListenerRef,

        // Additional setters
        setSelectedAddOns,
        setAppliedPartnerCode,
    };
}
