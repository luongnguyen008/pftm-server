import { INDICATOR_TYPE, COUNTRY_CODE, FREQUENCY, UNIT } from "../../types";
import { getDataABS } from "../common/abs";
import { fetchAndSave } from "../common/helper";
import { fetchMQL5Data } from "../common/mql5";
import { fetchRBAData } from "../common/rba";

export const updateManufacturingPMI = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.PMI,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      return fetchMQL5Data({
        url: "https://www.mql5.com/en/economic-calendar/australia/commonwealth-bank-manufacturing-pmi",
        country: COUNTRY_CODE.AUSTRALIA,
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
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      return fetchMQL5Data({
        url: "https://www.mql5.com/en/economic-calendar/australia/commonwealth-bank-services-pmi",
        country: COUNTRY_CODE.AUSTRALIA,
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
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      return fetchRBAData({
        fileName: "h03hist.xlsx",
        seriesId: "GICWMICS",
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.CONSUMER_SENTIMENT,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.INDEX,
      });
    },
  });
};

export const updateBuildingPermits = async () => {
  // TODO: Implement
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.BUILDING_PERMITS,
    country: COUNTRY_CODE.AUSTRALIA,
    fetchLogic: async () => {
      return getDataABS({
        pathName: "industry/building-and-construction/building-approvals-australia",
        fileName: "8731006.xlsx",
        seriesId: "A418431A",
        country: COUNTRY_CODE.AUSTRALIA,
        indicatorType: INDICATOR_TYPE.BUILDING_PERMITS,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.INDEX,
      });
    },
  });
};
