/* eslint-disable complexity */

import { useValidationStatus } from '@sanity/react-hooks';
import {
  Inline,
  Label,
  studioTheme,
  Tab,
  TabList,
  ThemeProvider,
} from '@sanity/ui';
import React from 'react';
import { MdErrorOutline } from 'react-icons/md';
import Flag from 'react-world-flags';

export default function SelectLanguage(props) {
  const { languages, selected, onChange, document } = props;

  const validation = useValidationStatus(document?.id, document?.type);

  const validationErrors = extractValidationErrorsPerLanguage(
    validation.markers,
    languages
  );

  return (
    <ThemeProvider theme={studioTheme}>
      <Inline space={[3]}>
        <Label size={2}>Select a language:</Label>

        <TabList space={1}>
          {languages.map((lang) => (
            <Tab
              style={{
                border: validationErrors[lang.id] ? '1px solid red' : undefined,
              }}
              key={lang.id}
              icon={
                <>
                  <Flag
                    code={lang.id === 'en' ? 'gb' : lang.id}
                    width="24"
                    height="12"
                  />
                  {validationErrors[lang.id] ? (
                    <MdErrorOutline
                      color={validationErrors[lang.id] ? 'red' : undefined}
                    />
                  ) : null}
                </>
              }
              label={lang.title}
              onClick={() => onChange([lang.id])}
              selected={selected.includes(lang.id)}
              space={2}
            />
          ))}
        </TabList>
      </Inline>
    </ThemeProvider>
  );
}

function extractValidationErrorsPerLanguage(markers, languages) {
  return languages.reduce((aggr, lang) => {
    aggr[lang.id] = markers.some(checkForLanguage(lang.id));
    return aggr;
  }, {});
}

function checkForLanguage(languageId) {
  return (marker) => marker.path.length === 2 && marker.path[1] === languageId;
}
