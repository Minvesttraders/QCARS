// App.jsx (ya App.js)
// QCARS - Quetta Car Showrooms App

// Required React hooks and Appwrite SDK
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

// --- Appwrite Context and Provider ---
// This context makes Appwrite services available throughout the application
const AppwriteContext = createContext();

const AppwriteProvider = ({ children }) => {
    // Initialize Appwrite client, account, databases, and storage services
    const client = new Client();
    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);

    // Set your Appwrite endpoint and Project ID
    // IMPORTANT: Make sure 'https://cloud.appwrite.io/v1' is correct or replace with your self-hosted endpoint
    client
        .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
        .setProject('685ed548003693db4ec5'); // Your Appwrite Project ID (PID)

    const [currentUser, setCurrentUser] = useState(null); // Stores logged-in user object
    const [isAuthReady, setIsAuthReady] = useState(false); // Flag to ensure authentication check is complete

    // useEffect hook to check user session when the component mounts
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const user = await account.get(); // Try to get the current user session
                setCurrentUser(user); // Set the user if session exists
            } catch (error) {
                console.error("No active session or error fetching user:", error);
                setCurrentUser(null); // No user or error, set to null
            } finally {
                setIsAuthReady(true); // Mark authentication check as completed
            }
        };

        checkUserSession(); // Call the function to check user session
    }, []); // Empty dependency array means this runs only once on mount

    // Provide Appwrite services (client, account, databases, storage) and user state to children
    return (
        <AppwriteContext.Provider value={{ client, account, databases, storage, currentUser, setCurrentUser, isAuthReady, ID }}>
            {children}
        </AppwriteContext.Provider>
    );
};

// Custom hook to easily access Appwrite services from any component
const useAppwrite = () => useContext(AppwriteContext);


// --- Utility Components ---

// Simple loading spinner component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full min-h-[200px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
    </div>
);

// Custom Modal component for displaying messages (alerts/confirmations)
const CustomModal = ({ title, message, onClose, onConfirm, showCancel = false }) => {
    if (!message) return null; // If no message, don't display the modal

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-auto transform transition-all scale-100 ease-out duration-300">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">{title}</h3>
                <p className="text-gray-700 mb-6 text-base">{message}</p>
                <div className="flex justify-end space-x-3">
                    {showCancel && (
                        <button
                            onClick={onClose}
                            className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={onConfirm || onClose} // If onConfirm is provided, use it, else just close
                        className="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                    >
                        {showCancel ? 'Confirm' : 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Language Context and Provider ---
// This context handles language switching (English/Urdu)
const LanguageContext = createContext();

const languages = {
    en: {
        appName: "QCARS",
        login: "Login",
        register: "Register",
        email: "Email",
        password: "Password",
        contactNumber: "Contact Number",
        showroomName: "Showroom Name",
        forgotPassword: "Forgot Password?",
        home: "Home",
        postCar: "Post Car",
        chat: "Chat",
        profile: "Profile",
        search: "Search...",
        logout: "Logout",
        uploadImages: "Upload Car Images (1-20)",
        carName: "Car Name/Model",
        price: "Full & Final Price",
        condition: "Condition",
        touchUpDetails: "Touch-up/Paint Details",
        mileage: "Mileage (km)",
        year: "Year",
        fuelType: "Fuel Type",
        transmission: "Transmission",
        submitListing: "Submit Listing",
        myListings: "My Listings",
        subscriptionStatus: "Subscription Status",
        paymentAccounts: "Payment Accounts",
        personalChat: "Personal Chat",
        globalChat: "Global Chat",
        sendMessage: "Send Message",
        typeMessage: "Type your message...",
        messageSent: "Message sent!",
        markAsSold: "Mark as Sold",
        accountRestricted: "Your account is restricted. Please renew your subscription to activate your account and view/post listings.",
        paymentInfo: "To activate your account, please make the monthly payment to one of the following accounts and inform the admin. Your account will be activated manually after verification.",
        registerSuccess: "Registration successful! Please login.",
        loginSuccess: "Login successful!",
        loginFailed: "Login failed. Please check your credentials.",
        carPostSuccess: "Car listing posted successfully!",
        carPostFailed: "Failed to post car listing.",
        noListings: "No car listings available.",
        noChats: "No chats yet.",
        imageUploadFailed: "Failed to upload image.",
        profileUpdateSuccess: "Profile updated successfully!",
        profileUpdateFailed: "Failed to update profile.",
        passwordResetRequestSent: "Password reset link sent to your email. Please check your inbox.",
        passwordResetFailed: "Failed to send password reset email.",
        confirmLogout: "Are you sure you want to logout?",
        loadingData: "Loading data...",
        cameraAccessDenied: "Camera access denied. Please enable camera permissions in your browser settings.",
        takePhoto: "Take Photo",
        chooseFile: "Choose File",
        uploading: "Uploading...",
        selectCondition: "Select Condition",
        selectFuelType: "Select Fuel Type",
        selectTransmission: "Select Transmission",
        selectUser: "-- Select a user --",
        sentBy: "Sent By",
        you: "You",
        active: "Active",
        inactive: "Inactive",
        confirmPayment: "Confirm Payment (Inform Admin)",
        noUserLoggedIn: "No user logged in."
    },
    ur: {
        appName: "کیو کارز",
        login: "لاگ ان",
        register: "رجسٹر کریں",
        email: "ای میل",
        password: "پاس ورڈ",
        contactNumber: "رابطہ نمبر",
        showroomName: "شوروم کا نام",
        forgotPassword: "پاس ورڈ بھول گئے؟",
        home: "ہوم",
        postCar: "گاڑی پوسٹ کریں",
        chat: "چیٹ",
        profile: "پروفائل",
        search: "تلاش کریں...",
        logout: "لاگ آؤٹ",
        uploadImages: "گاڑی کی تصاویر اپ لوڈ کریں (1-20)",
        carName: "گاڑی کا نام/ماڈل",
        price: "مکمل اور حتمی قیمت",
        condition: "حالت",
        touchUpDetails: "ٹچ اپ/پینٹ کی تفصیلات",
        mileage: "مائلیج (کلومیٹر)",
        year: "سال",
        fuelType: "ایندھن کی قسم",
        transmission: "ٹرانسمیشن",
        submitListing: "لسٹنگ جمع کروائیں",
        myListings: "میری لسٹنگز",
        subscriptionStatus: "سبسکرپشن کی حیثیت",
        paymentAccounts: "ادائیگی کے اکاؤنٹس",
        personalChat: "ذاتی چیٹ",
        globalChat: "عالمی چیٹ",
        sendMessage: "پیغام بھیجیں",
        typeMessage: "اپنا پیغام لکھیں...",
        messageSent: "پیغام بھیج دیا گیا!",
        markAsSold: "بک گئی نشاندہی کریں",
        accountRestricted: "آپ کا اکاؤنٹ محدود ہے۔ براہ کرم اپنے اکاؤنٹ کو فعال کرنے اور لسٹنگز دیکھنے/پوسٹ کرنے کے لیے اپنی سبسکرپشن کی تجدید کریں۔",
        paymentInfo: "اپنے اکاؤنٹ کو فعال کرنے کے لیے، براہ کرم درج ذیل اکاؤنٹس میں سے کسی ایک پر ماہانہ ادائیگی کریں اور ایڈمن کو مطلع کریں۔ آپ کا اکاؤنٹ تصدیق کے بعد دستی طور پر فعال کر دیا جائے گا۔",
        registerSuccess: "رجسٹریشن کامیاب! براہ کرم لاگ ان کریں۔",
        loginSuccess: "لاگ ان کامیاب!",
        loginFailed: "لاگ ان ناکام ہو گیا۔ براہ کرم اپنی تفصیلات چیک کریں۔",
        carPostSuccess: "گاڑی کی لسٹنگ کامیابی سے پوسٹ ہو گئی!",
        carPostFailed: "گاڑی کی لسٹنگ پوسٹ کرنے میں ناکام۔",
        noListings: "کوئی گاڑی کی لسٹنگ دستیاب نہیں ہے۔",
        noChats: "ابھی تک کوئی چیٹ نہیں ہے۔",
        imageUploadFailed: "تصویر اپ لوڈ کرنے میں ناکام۔",
        profileUpdateSuccess: "پروفائل کامیابی سے اپ ڈیٹ ہو گیا!",
        profileUpdateFailed: "پروفائل اپ ڈیٹ کرنے میں ناکام۔",
        passwordResetRequestSent: "پاس ورڈ دوبارہ سیٹ کرنے کا لنک آپ کے ای میل پر بھیج دیا گیا ہے۔ براہ کرم اپنا ان باکس چیک کریں۔",
        passwordResetFailed: "پاس ورڈ دوبارہ سیٹ کرنے کا ای میل بھیجنے میں ناکام۔",
        confirmLogout: "کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟",
        loadingData: "ڈیٹا لوڈ ہو رہا ہے...",
        cameraAccessDenied: "کیمرہ تک رسائی سے انکار کیا گیا۔ براہ کرم اپنے براؤزر کی ترتیبات میں کیمرہ کی اجازت فعال کریں۔",
        takePhoto: "تصویر لیں",
        chooseFile: "فائل منتخب کریں",
        uploading: "اپ لوڈ ہو رہا ہے...",
        selectCondition: "حالت منتخب کریں",
        selectFuelType: "ایندھن کی قسم منتخب کریں",
        selectTransmission: "ٹرانسمیشن منتخب کریں",
        selectUser: "-- صارف منتخب کریں --",
        sentBy: "بھیجا گیا بذریعہ",
        you: "آپ",
        active: "فعال",
        inactive: "غیر فعال",
        confirmPayment: "ادائیگی کی تصدیق کریں (ایڈمن کو مطلع کریں)",
        noUserLoggedIn: "کوئی صارف لاگ ان نہیں ہے۔"
    }
};

const LanguageProvider = ({ children }) => {
    // State to manage current language, default to English
    const [language, setLanguage] = useState('en');
    // Get current translations based on selected language
    const currentTranslations = languages[language];

    // Function to toggle language between English and Urdu
    const toggleLanguage = () => {
        setLanguage(prevLang => (prevLang === 'en' ? 'ur' : 'en'));
    };

    // Provide language state, translations, and toggle function to children
    return (
        <LanguageContext.Provider value={{ language, setLanguage, currentTranslations, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Custom hook to easily access language context
const useLanguage = () => useContext(LanguageContext);

// --- Auth Component (Login/Registration) ---
const Auth = ({ setPage }) => {
    const { account, databases, setCurrentUser, ID } = useAppwrite();
    const { currentTranslations, setLanguage } = useLanguage();

    const [isLogin, setIsLogin] = useState(true); // Toggles between login and registration form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [showroomName, setShowroomName] = useState('');
    const [modalMessage, setModalMessage] = useState(''); // Message for the custom modal
    const [modalTitle, setModalTitle] = useState(''); // Title for the custom modal

    // Handles user login
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setModalMessage(''); // Clear any previous modal message
        try {
            await account.createEmailPasswordSession(email, password); // Create email/password session
            const user = await account.get(); // Get logged-in user details
            setCurrentUser(user); // Update global user state
            setModalTitle("Success");
            setModalMessage(currentTranslations.loginSuccess);
            setTimeout(() => setPage('dashboard'), 1500); // Redirect to dashboard after success
        } catch (error) {
            console.error("Login failed:", error);
            setModalTitle("Error");
            setModalMessage(`${currentTranslations.loginFailed} ${error.message}`);
        }
    };

    // Handles user registration
    const handleRegister = async (e) => {
        e.preventDefault();
        setModalMessage('');
        try {
            // Create user account in Appwrite Authentication
            const newUser = await account.create(
                ID.unique(), // Generate unique ID for the new user
                email,
                password,
                showroomName // Name parameter is used as the user's name
            );

            // Create a document in the 'users' collection to store additional profile details
            // 'default' is the default database ID, replace if you have a custom one
            // 'users' is the collection ID where user profiles are stored (MUST BE CREATED IN APPWRITE CONSOLE)
            await databases.createDocument(
                'default',
                'users',
                newUser.$id, // Use the new user's Appwrite ID as the document ID
                {
                    name: showroomName,
                    contactNumber: contactNumber,
                    email: email,
                    isPremium: false, // Default subscription status is inactive
                    language: language // Set user's preferred language
                }
            );

            setModalTitle("Success");
            setModalMessage(currentTranslations.registerSuccess);
            setIsLogin(true); // Switch to login form after successful registration
        } catch (error) {
            console.error("Registration failed:", error);
            setModalTitle("Error");
            setModalMessage(`Registration failed: ${error.message}`);
        }
    };

    // Handles password reset request
    const handleForgotPassword = async () => {
        setModalMessage('');
        if (!email) {
            setModalTitle("Error");
            setModalMessage("Please enter your email to reset password.");
            return;
        }
        try {
            // Create a password recovery link
            // Replace `window.location.origin}/reset-password` with your actual reset password page URL
            await account.createRecovery(email, `${window.location.origin}/reset-password`);
            setModalTitle("Success");
            setModalMessage(currentTranslations.passwordResetRequestSent);
        } catch (error) {
            console.error("Forgot password failed:", error);
            setModalTitle("Error");
            setModalMessage(`${currentTranslations.passwordResetFailed} ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
            <CustomModal
                title={modalTitle}
                message={modalMessage}
                onClose={() => setModalMessage('')}
            />
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-[1.01]">
                <h2 className="text-4xl font-extrabold text-center text-purple-700 mb-8">
                    {isLogin ? currentTranslations.login : currentTranslations.register}
                </h2>

                <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                            {currentTranslations.email}:
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                            placeholder={currentTranslations.email}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                            {currentTranslations.password}:
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                            placeholder={currentTranslations.password}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <>
                            <div>
                                <label htmlFor="contactNumber" className="block text-gray-700 text-sm font-semibold mb-2">
                                    {currentTranslations.contactNumber}:
                                </label>
                                <input
                                    type="text"
                                    id="contactNumber"
                                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                                    placeholder={currentTranslations.contactNumber}
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="showroomName" className="block text-gray-700 text-sm font-semibold mb-2">
                                    {currentTranslations.showroomName}:
                                </label>
                                <input
                                    type="text"
                                    id="showroomName"
                                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                                    placeholder={currentTranslations.showroomName}
                                    value={showroomName}
                                    onChange={(e) => setShowroomName(e.target.value)}
                                   
