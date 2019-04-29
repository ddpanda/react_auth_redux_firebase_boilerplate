import * as actionTypes from './actionTypes';

export const signUp = data => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  dispatch({ type: actionTypes.AUTH_START });
  try {
    // create new user
    const res = await firebase
      .auth()
      .createUserWithEmailAndPassword(data.email, data.password);

    const user = firebase.auth().currentUser;
    await user.sendEmailVerification();
    console.log('sent');

    // save user to firebase with the doc id being the new created id we got from the response
    await firestore
      .collection('users')
      .doc(res.user.uid)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
      });

    // dispatch signup success
    dispatch({
      type: actionTypes.SIGNUP_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.SIGNUP_FAIL,
      payload: err.message,
    });
  }
  dispatch({ type: actionTypes.AUTH_END });
};

export const signIn = data => async (dispatch, getState, { getFirebase }) => {
  // We get a firebase instance here
  const firebase = getFirebase();
  dispatch({ type: actionTypes.AUTH_START });
  try {
    await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
    dispatch({
      type: actionTypes.AUTH_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.AUTH_FAIL,
      payload: err.message,
    });
  }
  dispatch({ type: actionTypes.AUTH_END });
};

export const signOut = () => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();

  try {
    await firebase.auth().signOut();
  } catch (err) {
    console.log('error logging out');
  }
};

export const sendVerificationEmail = () => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  dispatch({ type: actionTypes.VERIFICATION_EMAIL_START });
  const user = getFirebase().auth().currentUser;
  try {
    await user.sendEmailVerification();
    dispatch({
      type: actionTypes.VERIFICATION_EMAIL_SUCCESS,
    });
    console.log('email sent');
  } catch (err) {
    dispatch({
      type: actionTypes.VERIFICATION_EMAIL_FAIL,
      payload: err.message,
    });
  }
};

export const updateProfile = data => async (
  dispatch,
  getState,
  { getFirestore, getFirebase }
) => {
  const firestore = getFirestore();
  const userId = getState().firebase.auth.uid;
  dispatch({ type: actionTypes.EDIT_PROFILE_START });
  try {
    // save user to firebase with the doc id being the new created id we got from the response
    await firestore
      .collection('users')
      .doc(userId)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
      });
    dispatch({ type: actionTypes.EDIT_PROFILE_SUCCESS });
  } catch (err) {
    dispatch({ type: actionTypes.EDIT_PROFILE_FAIL, payload: err.message });
  }
};

// To clear errors and some stuff when components unmount
export const clear = () => ({
  type: actionTypes.CLEAR,
});

export const resetPassword = email => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const auth = getFirebase().auth();
  try {
    const res = await auth.sendPasswordResetEmail(email);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
