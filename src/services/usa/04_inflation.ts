import { calculateChange } from "../../lib/utils";
import { COUNTRY_CODE, FREQUENCY, INDICATOR_TYPE, UNIT } from "../../types";
import { getDataFRED } from "../common/fred";
import { fetchAndSave } from "../common/helper";
import { getIndicatorsByType } from "../common/repository";
import { logger } from "../../lib/logger";

export const updateCPIUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.CPI,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "CPIAUCSL",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.CPI,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.INDEX,
      });
    },
  });
};

export const updateCoreCPIUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.CORE_CPI,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "CPILFESL",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.CORE_CPI,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.INDEX,
      });
    },
  });
};

export const updatePPIUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.PPI,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "WPSFD49207",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.PPI,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.INDEX,
      });
    },
  });
};

export const updateCorePPIUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.CORE_PPI,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      return getDataFRED({
        seriesId: "WPSFD4131",
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.CORE_PPI,
        frequency: FREQUENCY.MONTHLY,
        unit: UNIT.INDEX,
      });
    },
  });
};

export const updateCPIChangeUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.CPI_CHANGE,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      logger.info("Calculating CPI Change...", "USA");

      // Fetch CPI data
      const cpiData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.CPI,
      });

      if (cpiData.length === 0) {
        logger.warn("No CPI data found for change calculation.", "USA");
        return [];
      }

      return calculateChange(cpiData, INDICATOR_TYPE.CPI_CHANGE, COUNTRY_CODE.USA);
    },
  });
};

export const updateCoreCPIChangeUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.CORE_CPI_CHANGE,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      logger.info("Calculating Core CPI Change...", "USA");

      // Fetch Core CPI data
      const coreCpiData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.CORE_CPI,
      });

      if (coreCpiData.length === 0) {
        logger.warn("No Core CPI data found for change calculation.", "USA");
        return [];
      }

      return calculateChange(coreCpiData, INDICATOR_TYPE.CORE_CPI_CHANGE, COUNTRY_CODE.USA);
    },
  });
};

export const updatePPIChangeUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.PPI_CHANGE,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      logger.info("Calculating PPI Change...", "USA");

      // Fetch PPI data
      const ppiData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.PPI,
      });

      if (ppiData.length === 0) {
        logger.warn("No PPI data found for change calculation.", "USA");
        return [];
      }

      return calculateChange(ppiData, INDICATOR_TYPE.PPI_CHANGE, COUNTRY_CODE.USA);
    },
  });
};

export const updateCorePPIChangeUSA = async () => {
  await fetchAndSave({
    indicatorType: INDICATOR_TYPE.CORE_PPI_CHANGE,
    country: COUNTRY_CODE.USA,
    fetchLogic: async () => {
      logger.info("Calculating Core PPI Change...", "USA");

      // Fetch Core PPI data
      const corePpiData = await getIndicatorsByType({
        country: COUNTRY_CODE.USA,
        indicatorType: INDICATOR_TYPE.CORE_PPI,
      });

      if (corePpiData.length === 0) {
        logger.warn("No Core PPI data found for change calculation.", "USA");
        return [];
      }

      return calculateChange(corePpiData, INDICATOR_TYPE.CORE_PPI_CHANGE, COUNTRY_CODE.USA);
    },
  });
};
