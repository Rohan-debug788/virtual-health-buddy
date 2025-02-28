Virtual Health Buddy

Overview

The Virtual Health Buddy is a web-based application designed to help users log their symptoms, receive personalized health tips, track their health history, and access emergency contacts. The app focuses on providing practical advice and simple health tracking without replacing professional medical consultations.

Features

Symptom Logger: Users can enter their symptoms, and the app generates tailored health tips.

Health Tips: Personalized health suggestions based on logged symptoms.

Health Tracker: Allows users to track their symptom history over time.

Emergency Contacts: Displays emergency contacts and, if permitted, shows local emergency services based on the user's location.

Local Storage Integration: Symptom history is stored in the browser's local storage for persistence.

Installation

Clone the repository:

git clone <repository-url>
cd virtual-health-buddy

Install dependencies:

npm install

Start the development server:

npm run dev

Access the app:
Open your browser and navigate to the link provided by Vite (usually http://localhost:5173).

Usage

Logging Symptoms

Navigate to the Symptoms tab.

Enter your symptoms in the text box.

Click the Get Health Tips button.

View personalized health tips and have your symptoms added to your history.

Viewing Health Tips

Go to the Tips tab to view suggestions for managing your logged symptoms.

Tracking Health History

The Tracker tab shows a chronological history of symptoms and health tips.

Emergency Contacts

Visit the Emergency tab to view important contact information.

Allow location access for local emergency services (optional).

Technology Stack

Frontend: React with TypeScript

Styling: Tailwind CSS

Icons: Lucide-react

State Management: React hooks (useState, useEffect)

Data Storage: LocalStorage

Development Server: Vite

Future Enhancements

Integrate AI APIs for more advanced health suggestions.

Add user authentication for multi-profile support.

Implement a more sophisticated backend to store and manage health data.

Disclaimer

The Virtual Health Buddy app provides general health tips and is not a substitute for professional medical advice. Always seek the advice of your physician or another qualified health provider with any questions you may have regarding a medical condition.

License

This project is licensed under the MIT License.

Contact

For further information or collaboration, feel free to reach out via [degaullerohan@gmail.com].