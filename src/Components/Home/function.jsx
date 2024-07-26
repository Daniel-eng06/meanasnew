const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.checkSubscription = functions.https.onCall(async (data, context) => {
  const userId = context.auth.uid;

  if (!userId) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  try {
    const subscriptionRef = admin.firestore().collection("subscriptions").doc(userId);
    const subscriptionDoc = await subscriptionRef.get();

    if (!subscriptionDoc.exists) {
      return { isActive: false };
    }

    const subscriptionData = subscriptionDoc.data();
    const currentDate = new Date();
    const endDate = new Date(subscriptionData.endDate);

    const isActive = currentDate <= endDate;

    return { isActive, tier: subscriptionData.tier };
  } catch (error) {
    console.error("Error checking subscription:", error);
    throw new functions.https.HttpsError("internal", "Error checking subscription.");
  }
});
