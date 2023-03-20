import { createSlice } from '@reduxjs/toolkit';

export const journalSlice = createSlice({
    name: 'template',
    initialState: {
        isSaving: false,
        messageSaved: '',
        notes: [],
        //   active: null,
        // active: {
        //     id: 'ABC123',
        //     title: '',
        //     body: '',
        //     date: 123456789,
        //     imageUrls: [], // https://photo1.jpg, https://photo2.jpg, https://photo3.jpg, 
        // }
    },
        reducers: {
            savingNewNotes: ( state ) => {
                state.isSaving = true;
            },
            addNewEmptyNote: (state, action) => {
                state.notes.push( action.payload );
                state.isSaving = false;
            },
            setActiveNote: (state, action) => {
                state.active = action.payload;
                state.messageSaved = '';
            },
            setNotes: (state, action) => {
                state.notes = action.payload;
            },
            setSaving: (state) => {
                state.isSaving = true;
                state.messageSaved = '';
            },
            uptdateNote: (state, action) => { // payload: note
                state.isSaving = false;
                state.notes = state.notes.map( note => {
                    
                    if ( note.id === action.payload.id ) {
                        return action.payload; // This causes it to leave the value
                    }

                    return note;
                });

                state.messageSaved = `${ action.payload.title }, actualizada correctamente`;
            },

            setPhotoToActiveNote: (state, action) => {
                state.active.imageUrls = [ ...state.active.imageUrls, ...action.payload ];
                state.isSaving = false;
            },
            clearNotesLogout: (state) => {
                state.isSaving = false;
                state.messageSaved = '';
                state.notes = [];
                state.active = null;
            },

            deleteNodeById: (state, action) => {
                state.active = null;
                state.notes = state.notes.filter( note => note.id !== action.payload );
            },
        }
});


// Action creators are generated for each case reducer function
export const { 
    addNewEmptyNote,
    clearNotesLogout,
    deleteNodeById,
    uptdateNote,
    savingNewNotes,
    setActiveNote,
    setNotes,
    setPhotoToActiveNote,
    setSaving,
 } = journalSlice.actions;