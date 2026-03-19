import React from 'react';
import {
  IonHeader,
  IonRow,
  IonItemDivider,
  IonIcon,
  IonContent,
} from '@ionic/react';

const TermsAndConditionsPage = ({ moveBackOnTap }) => {
  return (
    <>
      <IonHeader>
        <IonRow>
          <IonItemDivider>
            <IonIcon
              className="add-icon"
              name="arrow-back"
              onClick={() => moveBackOnTap()}
            ></IonIcon>
            <h1>Terms & Conditions</h1>
          </IonItemDivider>
        </IonRow>
      </IonHeader>

      <IonContent>
        <div className="screen-content">
          <h1 style={{ color: 'red' }}>Terms and Conditions</h1>

          <h3 style={{ color: 'red' }}>Introduction</h3>

          1. The CRUNCHTIME DELIVERY (PTY) LTD (REG NO: 2021/979448/07) software application
          (the "App") is available for download from various app stores identified by Crunchtime
          Delivery Pty Ltd from time to time, on compatible electronic devices, or accessible through
          the Mobi site. The App is owned and operated by Crunchtime Delivery Ltd ("Crunchtime
          Delivery Pty Ltd", "we", "us" and "our").
          2. The App enables users to order and purchase food, beverages and other items (the "Food")
          from any of the Vendors, listed on the App (each a "Vendor").
          3. These terms and conditions ("Terms and Conditions") govern the ordering, sale, delivery
          and collection of Food, and the use of the App. These Terms and Conditions are binding and
          enforceable against every person that accesses or uses the App ("you", "your" or "user"),
          including without limitation each user who registers as contemplated below ("registered
          user"). By using the App, you acknowledge that you have read and agree to be bound by
          these Terms and Conditions. You must not use the App or Telephone Service if you do not
          agree to the Terms and Conditions.
          <h3>Important Notice</h3>
          {/* ... (rest of your content remains unchanged) ... */}
          {/* For brevity, the full content should be included here, as in the JSX above */}
        </div>
      </IonContent>
    </>
  );
};

export default TermsAndConditionsPage;