import React from "react";

const Panel = ({
  dias,
  investiment,
  costOfDelay,
  resources,
  useResources,
  hoursDelivery
}) => {
  return (
    <div className="panel">
      <h2>Summary</h2>

      <div className="grid2x2">
        <div className="box">
          <div>
            <h3>
              Dias corridos
              <br /> {dias}
            </h3>
          </div>
        </div>
        <div className="box">
          <div>
            <h3>
              Desenvolvedores alocados:
              <br /> {useResources}/{resources}
            </h3>
          </div>
        </div>
        <div className="box">
          <div>
            <h3>
              Investimento: <br />
              R$
              {new String(investiment.toFixed(2)).replace(".", ",")}
            </h3>
          </div>
        </div>
        <div className="box">
          <div>
            <h3>
              CA recuperado: R$
              <br />
              {new String(costOfDelay.toFixed(2)).replace(".", ",")}
            </h3>
          </div>
        </div>
        <div className="box">
          <div>
            <h3>
              Horas trabalhadas:
              <br /> {hoursDelivery}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panel;
