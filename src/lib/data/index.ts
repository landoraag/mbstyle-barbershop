"use client";

import { demoSource } from "./demo";
import { firebaseSource, hasFirebaseConfig } from "./firebase";
import type { DataSource } from "./types";

export const data: DataSource = hasFirebaseConfig ? firebaseSource : demoSource;
export * from "./types";
