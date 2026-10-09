"use client";

import { createContext, useContext } from "react";

/**
 * Lets a container hold its scene loops still (e.g. a Work tile while it is
 * hovered). Scenes read it and stop their clock; they resume where they left off.
 */
export const ScenePause = createContext(false);

export const useScenePaused = () => useContext(ScenePause);
