import React, { useState, useEffect, createContext, useContext } from 'react';
import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

// Appwrite Configuration (Moved to a separate context for easier access and management)
const AppwriteContext = createContext();

// Appwrite Provider Component
const AppwriteProvider = ({ children }) => {
    // Initialize Appwrite client, account, databases, and storage
    const client = new Client();
    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);

    // Set Appwrite endpoint and project ID from environment variables or hardcoded for example
    client
        .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
        .setProject('685ed548003693db4ec5'); // Your Appwrite Project ID

    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false); // To ensure auth state is checked

    // Effect to check user session on mount
    useEffect(() => {
        const checkUser = async () => {
            try {
                const user = await account.get();
                setCurrentUser(user);
            } catch (error) {
                console.error("No active session or error fetching user:", error);
                setCurrentUser(null);
            } finally {
                setIsAuthReady(true); // Mark authentication check as complete
            }
        };

        checkUser();
    }, []);

    // Provide Appwrite services and user state to children components
    return (
        <AppwriteContext.Provider value={{ client, account, databases, storage, currentUser, setCurrentUser, isAuthReady, ID }}>
            {children}
        </AppwriteContext.Provider>
    );
};

// Custom hook to use Appwrite services
const useAppwrite = () => useContext(AppwriteContext);


// --- Utility Components ---

// Simple loading spinner
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
    </div>
);

// Custom Modal component for alerts and confirmations
const CustomModal = ({ title, message, onClose, onConfirm, showCancel = false }) => {
    if (!message) return null; // Don't show if no message

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    {showCancel && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={onConfirm || onClose} // If no confirm, just close
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
                    >
                        {showCancel ? 'Confirm' : 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Language Context and Provider ---
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
        mileage: "Mileage",
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
        accountRestricted: "Your account is restricted. Please renew your subscription.",
        paymentInfo: "To activate your account, please make the monthly payment to one of the following accounts and inform the admin.",
        paymentSuccess: "Payment confirmed successfully! Your account is now active.",
        paymentFailed: "Payment confirmation failed. Please try again or contact admin.",
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
        passwordResetRequestSent: "Password reset link sent to your email.",
        passwordResetFailed: "Failed to send password reset email.",
        confirmLogout: "Are you sure you want to logout?",
        loadingData: "Loading data...",
        cameraAccessDenied: "Camera access denied. Please enable camera permissions in your browser settings.",
        takePhoto: "Take Photo",
        chooseFile: "Choose File",
        uploading: "Uploading..."
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
        mileage: "مائلیج",
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
        accountRestricted: "آپ کا اکاؤنٹ محدود ہے۔ براہ کرم اپنی سبسکرپشن کی تجدید کریں۔",
        paymentInfo: "اپنے اکاؤنٹ کو فعال کرنے کے لیے، براہ کرم درج ذیل اکاؤنٹس میں سے کسی ایک پر ماہانہ ادائیگی کریں اور ایڈمن کو مطلع کریں۔",
        paymentSuccess: "ادائیگی کی تصدیق کامیابی سے ہو گئی! آپ کا اکاؤنٹ اب فعال ہے۔",
        paymentFailed: "ادائیگی کی تصدیق ناکام ہو گئی۔ براہ کرم دوبارہ کوشش کریں یا ایڈمن سے رابطہ کریں۔",
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
        passwordResetRequestSent: "پاس ورڈ دوبارہ سیٹ کرنے کا لنک آپ کے ای میل پر بھیج دیا گیا ہے۔",
        passwordResetFailed: "پاس ورڈ دوبارہ سیٹ کرنے کا ای میل بھیجنے میں ناکام۔",
        confirmLogout: "کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟",
        loadingData: "ڈیٹا لوڈ ہو رہا ہے...",
        cameraAccessDenied: "کیمرہ تک رسائی سے انکار کیا گیا۔ براہ کرم اپنے براؤزر کی ترتیبات میں کیمرہ کی اجازت فعال کریں۔",
        takePhoto: "تصویر لیں",
        chooseFile: "فائل منتخب کریں",
        uploading: "اپ لوڈ ہو رہا ہے..."
    }
};

const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // Default language
    const currentTranslations = languages[language];

    const toggleLanguage = () => {
        setLanguage(prevLang => (prevLang === 'en' ? 'ur' : 'en'));
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, currentTranslations, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

const useLanguage = () => useContext(LanguageContext);

// --- Auth Component ---
const Auth = ({ setPage }) => {
    const { account, setCurrentUser, ID } = useAppwrite();
    const { currentTranslations, setLanguage } = useLanguage();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [showroomName, setShowroomName] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setModalMessage(''); // Clear previous messages
        try {
            await account.createEmailPasswordSession(email, password);
            const user = await account.get();
            setCurrentUser(user);
            setModalTitle("Success");
            setModalMessage(currentTranslations.loginSuccess);
            setTimeout(() => setPage('dashboard'), 1500); // Redirect to dashboard
        } catch (error) {
            console.error("Login failed:", error);
            setModalTitle("Error");
            setModalMessage(`${currentTranslations.loginFailed} ${error.message}`);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setModalMessage('');
        try {
            // Register user with email and password
            const newUser = await account.create(
                ID.unique(),
                email,
                password,
                showroomName // Name parameter for the user
            );

            // After successful user creation, create a document in 'users' collection
            // to store additional details like contactNumber and showroomName
            // Note: You need to set up 'users' collection in Appwrite console
            // with appropriate permissions for 'create' for 'role:member'.
            await databases.createDocument(
                'default', // Your database ID (e.g., 'default' or your custom ID)
                'users', // Your 'users' collection ID
                newUser.$id, // Use the new user's ID as the document ID
                {
                    name: showroomName,
                    contactNumber: contactNumber,
                    email: email,
                    isPremium: false, // Default to false
                    language: 'en' // Default language for new user
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

    const handleForgotPassword = async () => {
        setModalMessage('');
        if (!email) {
            setModalTitle("Error");
            setModalMessage("Please enter your email to reset password.");
            return;
        }
        try {
            await account.createRecovery(email, `${window.location.origin}/reset-password`); // Adjust recovery URL
            setModalTitle("Success");
            setModalMessage(currentTranslations.passwordResetRequestSent);
        } catch (error) {
            console.error("Forgot password failed:", error);
            setModalTitle("Error");
            setModalMessage(`${currentTranslations.passwordResetFailed} ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <CustomModal
                title={modalTitle}
                message={modalMessage}
                onClose={() => setModalMessage('')}
            />
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">{isLogin ? currentTranslations.login : currentTranslations.register}</h2>

                <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            {currentTranslations.email}:
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                            placeholder={currentTranslations.email}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            {currentTranslations.password}:
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                            placeholder={currentTranslations.password}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <>
                            <div>
                                <label htmlFor="contactNumber" className="block text-gray-700 text-sm font-bold mb-2">
                                    {currentTranslations.contactNumber}:
                                </label>
                                <input
                                    type="text"
                                    id="contactNumber"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                                    placeholder={currentTranslations.contactNumber}
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="showroomName" className="block text-gray-700 text-sm font-bold mb-2">
                                    {currentTranslations.showroomName}:
                                </label>
                                <input
                                    type="text"
                                    id="showroomName"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                                    placeholder={currentTranslations.showroomName}
                                    value={showroomName}
                                    onChange={(e) => setShowroomName(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-200"
                    >
                        {isLogin ? currentTranslations.login : currentTranslations.register}
                    </button>
                </form>

                <div className="flex flex-col items-center justify-between mt-4">
                    {isLogin ? (
                        <>
                            <button
                                onClick={() => setIsLogin(false)}
                                className="inline-block align-baseline font-bold text-sm text-purple-600 hover:text-purple-800 transition duration-200"
                            >
                                {currentTranslations.register}
                            </button>
                            <button
                                onClick={handleForgotPassword}
                                className="inline-block align-baseline font-bold text-sm text-purple-600 hover:text-purple-800 transition duration-200 mt-2"
                            >
                                {currentTranslations.forgotPassword}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsLogin(true)}
                            className="inline-block align-baseline font-bold text-sm text-purple-600 hover:text-purple-800 transition duration-200"
                        >
                            {currentTranslations.login}
                        </button>
                    )}
                </div>
                {/* Language Toggle for Auth page */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setLanguage('en')}
                        className={`px-3 py-1 rounded-l-md text-sm font-medium ${currentTranslations === languages.en ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage('ur')}
                        className={`px-3 py-1 rounded-r-md text-sm font-medium ${currentTranslations === languages.ur ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        اردو
                    </button>
                </div>
            </div>
      
