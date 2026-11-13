// The canvas and a tiny DOM helper, shared by everything that draws or builds UI.
export const cv = document.getElementById('c');
export const ctx = cv.getContext('2d');
export const $ = id => document.getElementById(id);
