import { set } from 'lodash';
import { useMemo } from 'react';
import { Dictionary, RegionGeoJSON, SafetyRegionProperties } from '../shared';

export interface RegionChoroplethValue {
  __color_value: number;
  vrcode: string;
  vrname: string;
  // [key: string]: unknown;
}

export type GetRegionDataFunctionType<T> = (id: string) => T;

type UseRegionDataReturnValue<T> = {
  getChoroplethValue: GetRegionDataFunctionType<T>;
  hasData: boolean;
};

/**
 * This hook takes a metric name, extracts the associated data from the json/regions.json
 * data file and merges these metrics with feature properties of the given featureCollection.
 *
 * A min and max domain is calculated based on the specified metric.
 *
 * When no metricName is provided only the feature properties are used.
 *
 * It returns a function that returns the merged data given a valid region code, as wel
 * as a noData indicator along with the generated domain.
 *
 * @param metricName
 * @param featureCollection
 * @param metricProperty
 */

export function useSafetyRegionData<T extends { vrcode: string }>(
  featureCollection: RegionGeoJSON,
  values: T[]
): UseRegionDataReturnValue<RegionChoroplethValue & T> {
  return useMemo(() => {
    const propertyData = featureCollection.features.reduce(
      (acc, feature) => set(acc, feature.properties.vrcode, feature.properties),
      {} as Record<string, SafetyRegionProperties>
    );

    if (!values) {
      return {
        getChoroplethValue: (id) =>
          ({ ...propertyData[id], __color_value: 0 } as RegionChoroplethValue &
            T),
        hasData: false,
      };
    }

    const mergedData = values.reduce((acc, value) => {
      const feature = featureCollection.features.find(
        (feat) => feat.properties.vrcode === value.vrcode
      );

      if (!feature) return acc;

      const choroplethValue: Omit<RegionChoroplethValue, '__color_value'> &
        T = {
        ...feature?.properties,
        /**
         * To access things like timestamps in the tooltip we simply merge all
         * metric properties in here. The result is what is passed to the
         * tooltop function.
         */
        ...value,
      };

      return set(acc, value.vrcode, choroplethValue);
    }, {} as Dictionary<RegionChoroplethValue & T>);

    const hasData = Object.keys(mergedData).length > 0;

    const getChoroplethValue = (id: string) => {
      const value = mergedData[id];
      return (
        value ||
        ({ ...propertyData[id], __color_value: 0 } as RegionChoroplethValue & T)
      );
    };

    return { getChoroplethValue, hasData };
  }, [values, featureCollection.features]);
}
