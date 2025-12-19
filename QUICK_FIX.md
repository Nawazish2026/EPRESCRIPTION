# Quick Fix

This file documents a quick fix that was applied to the codebase.

## Bug

The backend server was crashing with a `TypeError: Cannot read properties of undefined (reading 'id')` when creating a new prescription.

## Cause

The `auth` middleware was setting `req.userId` instead of `req.user`. The `prescriptions` route was expecting `req.user.id`.

## Fix

The `auth` middleware in `backend/middleware/auth.js` was corrected to set `req.user` to the decoded JWT token.