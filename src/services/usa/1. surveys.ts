import { COUNTRY_CODE, FREQUENCY, INDICATOR_TYPE, UNIT } from "../../types";
import { getDataFRED } from "../common/fred";
import { fetchAndSave } from "../common/helper";
import { fetchInvestingData } from "../common/investing";

export const updateManufacturingPMI = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.PMI,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return fetchInvestingData({
        url: "https://sbcharts.investing.com/events_charts/us/173.json",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.PMI,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.POINTS,
      });
    },
  });
};

export const updateServicesPMI = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.SERVICE_PMI,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return fetchInvestingData({
        url: "https://sbcharts.investing.com/events_charts/us/176.json",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.SERVICE_PMI,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.POINTS,
      });
    },
  });
};

export const updateConsumerSentiment = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.CONSUMER_SENTIMENT,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return fetchInvestingData({
        url: "https://sbcharts.investing.com/events_charts/us/320.json",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.CONSUMER_SENTIMENT,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.INDEX,
      });
    },
  });
};

export const updateBuildingPermits = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.BUILDING_PERMITS,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      // TODO: Find Investing.com URL for Building Permits
      return getDataFRED({
        seriesId: "PERMIT",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.BUILDING_PERMITS,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.THOUSANDS,
      });
    },
  });
};
