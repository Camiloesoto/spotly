"use client";

import { useMutation } from "@tanstack/react-query";
import {
  login,
  loginWithProvider,
  refreshSession,
  registerLocal,
  registerUser,
} from "./service";
import type {
  LocalRegisterPayload,
  LoginPayload,
  OAuthProvider,
  RegisterPayload,
  Session,
} from "./types";

export function useRegisterUserMutation() {
  return useMutation<Session, Error, RegisterPayload>({
    mutationFn: registerUser,
  });
}

export function useRegisterLocalMutation() {
  return useMutation<Session, Error, LocalRegisterPayload>({
    mutationFn: registerLocal,
  });
}

export function useLoginMutation() {
  return useMutation<Session, Error, LoginPayload>({
    mutationFn: login,
  });
}

export function useOAuthMutation() {
  return useMutation<{ redirectUrl: string }, Error, OAuthProvider>({
    mutationFn: loginWithProvider,
  });
}

export function useRefreshSessionMutation() {
  return useMutation<Session, Error, string>({
    mutationFn: refreshSession,
  });
}

