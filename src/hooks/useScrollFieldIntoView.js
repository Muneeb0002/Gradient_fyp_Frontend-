import { useCallback, useEffect, useRef } from "react";
import { Dimensions, Keyboard, Platform } from "react-native";

/**
 * Scrolls a ScrollView so a focused field (e.g. password) stays above the keyboard.
 * Fabric-safe: uses measureInWindow + keyboard height (no findNodeHandle / measureLayout).
 */
export function useScrollFieldIntoView() {
  const scrollRef = useRef(null);
  const fieldWrapRef = useRef(null);
  const scrollYRef = useRef(0);
  const keyboardHeightRef = useRef(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      keyboardHeightRef.current = e.endCoordinates?.height ?? 0;
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      keyboardHeightRef.current = 0;
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const onScroll = useCallback((e) => {
    scrollYRef.current = e.nativeEvent.contentOffset.y;
  }, []);

  const scrollFieldIntoView = useCallback(() => {
    const scroll = scrollRef.current;
    const wrap = fieldWrapRef.current;
    if (!scroll || !wrap) return;

    const winH = Dimensions.get("window").height;
    const fallbackKb = Math.round(winH * 0.36);

    const run = () => {
      const kbH = keyboardHeightRef.current > 0 ? keyboardHeightRef.current : fallbackKb;
      const bottomInset = Platform.OS === "ios" ? 20 : 28;
      const visibleBottom = winH - kbH - bottomInset;

      wrap.measureInWindow((_fx, fy, _fw, fh) => {
        const fieldBottom = fy + fh;
        if (fieldBottom <= visibleBottom) return;

        const delta = fieldBottom - visibleBottom + 12;
        scroll.scrollTo({
          y: Math.max(0, scrollYRef.current + delta),
          animated: true,
        });
      });
    };

    requestAnimationFrame(() => {
      setTimeout(run, Platform.OS === "ios" ? 320 : 260);
    });
  }, []);

  return { scrollRef, fieldWrapRef, onScroll, scrollFieldIntoView };
}
