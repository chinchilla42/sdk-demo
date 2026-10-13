import { useEffect, useCallback, useState } from "react";
import {
  useInitialize,
  useVisitorCode,
  useFeatureFlag,
  useData,
  CustomData,
} from "@kameleoon/react-sdk";

// -- Goal tracked when the banner button is clicked --
const BANNER_GOAL_ID = 335149;

export const useFeatureFlags = () => {

  const { initialize } = useInitialize();
  const { getVisitorCode, setLegalConsent } = useVisitorCode();
  const { getVariations, getEngineTrackingCode } = useFeatureFlag();
  const { trackConversion, addData, flush } = useData();

  const [featureFlagsData, setFeatureFlagsData] = useState({});
  const [engineCode, setEngineCode] = useState("");

  const init = useCallback(async () => {
    await initialize();

    const featureFlagObject = {};

    // -- Get visitor code
    const visitorCode = getVisitorCode();

    // ----------------------------------------------
    //-- Set legal consent for visitor

    setLegalConsent(visitorCode, true);
    // ----------------------------------------------

    featureFlagObject.visitorCode = visitorCode;

    // ----------------------------------------------
    // -- Add user agent for bot filtering --
    // (import UserAgent from "@kameleoon/react-sdk")

    // const userAgent = new UserAgent(window.navigator.userAgent);
    // addData(visitorCode, userAgent);
    //------------------------------------------------

    //-------------------------------------------------
    // -- Get remote visitor data --
    // (get getRemoteVisitorData from useData())

    // const kameleoonDataList = await getRemoteVisitorData({
    //   visitorCode,
    //   shouldAddData: true,
    //   filters,
    // });
    //-------------------------------------------------

    //-------------------------------------------------
    // -- Use page view for segmentation --
    // (import PageView from "@kameleoon/react-sdk")
    //
    // -- Define page view parameters --
    // const pageViewParameters = {
    //   urlAddress: window.location.href,
    //   title: document.title,
    //   referrers: document.referrer,
    // };
    //
    // -- Add new page view data to client --
    // const pageView = new PageView(pageViewParameters);
    // addData(visitorCode, pageView);
    // ---------------------------------------------------

    // const featureKey = "banner";

    // ----------------------------------------------------
    //-- Use isFeatureFlagActive to check if a feature flag is active for a visitor --
    // (get isFeatureFlagActive from useFeatureFlag())
    //
    // const active = isFeatureFlagActive({
    //   visitorCode,
    //   featureKey,
    //   track: false,
    // });
    // console.log("banner active", active);
    // ----------------------------------------------------

    // -----------------------------------------------------
    // -- Use getVariation to get the variation for a feature flag for a visitor --
    // (get getVariation from useFeatureFlag())
    //
    // const variation = getVariation({
    //   visitorCode,
    //   featureKey,
    //   track: false,
    // });
    // console.log("variation", variation);
    // -----------------------------------------------------

    // -----------------------------------------------------
    // -- Use getVariations to get the variations of all active feature flags for a visitor --

    const featureFlags = getVariations({
      visitorCode,
      onlyActive: true,
    });
    console.log("get variations", featureFlags);
    //-----------------------------------------------------

    // -- Get tracking code
    const trackingCode = getEngineTrackingCode(visitorCode);

    featureFlags.forEach((variation, featureKey) => {
      featureFlagObject[featureKey] = { id: variation.id };

      variation.variables.forEach((variable, varKey) => {
        featureFlagObject[featureKey][varKey] = variable.value;
      });

      // ------------------------------------------------------
      // -- Add custom data for visitor

      if (variation.variables.has("size")) {
        // -- Create instance of CustomData
        const customData = new CustomData(29, "test", "list");
        addData(visitorCode, customData);

        // -- Flush added custom data for visitor
        flush(visitorCode);
      }
      //------------------------------------------------
    });

    // -- Return feature flag list and tracking code
    return { featureFlagObject, trackingCode };

  }, [
    initialize,
    getVisitorCode,
    setLegalConsent,
    addData,
    flush,
    getVariations,
    getEngineTrackingCode,
  ]);

  useEffect(() => {
    let cancelled = false;
    init()
      .then(({ featureFlagObject, trackingCode }) => {
        if (cancelled) return;
        // -- Set feature flag list and tracking code to state
        setFeatureFlagsData(featureFlagObject);
        setEngineCode(trackingCode);
      })
      .catch((error) => console.error("Kameleoon initialization failed", error));
    return () => {
      cancelled = true;
    };
  }, [init]);

  useEffect(() => {
    // -- Insert tracking code into the page
    if (engineCode) {
      const script = document.createElement("script");
      script.textContent = engineCode;
      document.body.appendChild(script);
      // -- Remove script from the page
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [engineCode]);

  // ------------------------------------------------------
  // -- Track conversion on banner button click

  const { visitorCode } = featureFlagsData;
  const trackBannerClick = useCallback(() => {
    if (!visitorCode) return;
    console.log("conversion tracked");
    trackConversion({
      visitorCode,
      revenue: 20,
      goalId: BANNER_GOAL_ID,
      metadata: [new CustomData(26, "click")],
    });
  }, [visitorCode, trackConversion]);
  //------------------------------------------------

  return { featureFlagsData, trackBannerClick };
};
