import useSWR from 'swr';

import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { LineChart } from 'components/charts/index';
import { ContentHeader } from 'components/layout/Content';

import Arts from 'assets/arts.svg';

import siteText from 'locale';

import { IntakeIntensivecareMa } from 'types/data';

const text: typeof siteText.ic_opnames_per_dag = siteText.ic_opnames_per_dag;

export function IntakeIntensiveCareBarscale(props: {
  data: IntakeIntensivecareMa | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={30}
      gradient={[
        {
          color: '#69c253',
          value: 0,
        },
        {
          color: '#D3A500',
          value: 10,
        },
        {
          color: '#f35065',
          value: 20,
        },
      ]}
      rangeKey="moving_average_ic"
      screenReaderText={text.barscale_screenreader_text}
      signaalwaarde={10}
      value={data.last_value.moving_average_ic}
      id="ic"
    />
  );
}

const IntakeIntensiveCare: FCWithLayout = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const data: IntakeIntensivecareMa | undefined =
    state?.intake_intensivecare_ma;

  return (
    <>
      <ContentHeader
        category="Medische indicatoren"
        title={text.titel}
        Icon={Arts}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data?.last_value?.date_of_report_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>

          <IntakeIntensiveCareBarscale data={data} />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>

        {data && (
          <LineChart
            values={data.values.map((value) => ({
              value: value.moving_average_ic,
              date: value.date_of_report_unix,
            }))}
            signaalwaarde={10}
          />
        )}
      </article>
    </>
  );
};

IntakeIntensiveCare.getLayout = getNationalLayout();

export default IntakeIntensiveCare;