import { collection, deleteDoc, doc, setDoc } from "firebase/firestore/lite";
import { FirebaseDB } from "../../firebase/config";
import { fileUpload, loadNotes } from "../../helper";
import { addNewEmptyNote, deleteNodeById, savingNewNotes, setActiveNote, setNotes, setPhotoToActiveNote, setSaving, uptdateNote } from "./journalSlice";

export const startNewNote = () => {
    return async( dispatch, getState ) => {

        dispatch( savingNewNotes() );

        const { uid } = getState().auth;

        const newNote = {
            title: '',
            body: '',
            imageUrls: [],
            date: new Date().getTime(),
        }

        const newDoc = doc( collection( FirebaseDB, `${ uid }/journal/notes`) );
        const setDocResp = await setDoc( newDoc, newNote );

        newNote.id = newDoc.id;
        //! dispatch
        dispatch( addNewEmptyNote( newNote ) );
        dispatch( setActiveNote( newNote ) );
        // dispatch( activeNote )
    }
}

export const startLoadingNotes = ( ) => {
    return async( dispatch, getState ) => {

        const { uid } = getState().auth;
        if ( !uid ) throw new Error('User UID does not exist');

        const notes = await loadNotes( uid );
        dispatch( setNotes( notes ) );
    }
}

export const startSaveNote = () => {
    return async( dispatch, getState ) => {

        dispatch( setSaving() ); // This update the note in daatabase

        const { uid } = getState().auth;
        const { active:note } = getState().journal;

        const noteToFireStore = { ...note };
        delete noteToFireStore.id; // Here delete a property from ...note

        const docRef = doc( FirebaseDB, `${ uid }/journal/notes/${ note.id }`) // this is a reference to the doc
        await setDoc( docRef, noteToFireStore, { merge: true }); // way to impact the firebase database

        dispatch( uptdateNote( note) );
    }
}

export const startUploadingFiles = ( files = [] ) => {
    return async( dispatch ) => {
        dispatch( setSaving );
        
        // await fileUpload( files[0] );
        const fileUploadPromises = [];
        for ( const file of files ) {
            fileUploadPromises.push( fileUpload( file ) );
        }

        const photoUrls = await Promise.all( fileUploadPromises );
        dispatch(  setPhotoToActiveNote( photoUrls ) );
    }
}


export const startDeletingNote = () => {
    return async( dispatch, getState ) => {

        const { uid } = getState().auth;
        const { active:note } = getState().journal;

        const docRef = doc( FirebaseDB, `${ uid }/journal/notes/${ note.id }`); // This create an element reference
        await deleteDoc( docRef ); // This delete the note

        dispatch( deleteNodeById( note.id ) ); // Clear store
    }
}