interface GlacierPageHeaderProps {
  mainGlacierDetails: {
    glacierName: string;
    areaM2: number;
  };
  compareGlacierDetails: {
    glacierName: string;
    areaM2: number;
  }[];
}

export default function GlacierPageHeader({
  mainGlacierDetails,
  compareGlacierDetails,
}: GlacierPageHeaderProps) {
  const compare: boolean = compareGlacierDetails.length > 0;

  return (
    <div>
      <h2>{mainGlacierDetails.glacierName}</h2>
      {compare && (
        <h3>
          Comparing with:{" "}
          {compareGlacierDetails
            .map((glacier) => glacier.glacierName)
            .join(", ")}
        </h3>
      )}
      {compare ? (
        compareGlacierDetails.length > 1 ? (
          <table>
            <thead>
              <tr>
                <th>Glacier Name</th>
                <th>Area (km²)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{mainGlacierDetails.glacierName}</td>
                <td>{(mainGlacierDetails.areaM2 / 1_000_000).toFixed(2)}</td>
              </tr>
              {compareGlacierDetails.map((glacier) => (
                <tr key={glacier.glacierName}>
                  <td>{glacier.glacierName}</td>
                  <td>{(glacier.areaM2 / 1_000_000).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>
            Area: {(mainGlacierDetails.areaM2 / 1_000_000).toFixed(2)}km
            <sup>2</sup>
            {compare && (
              <>
                &nbsp; | &nbsp;
                {(compareGlacierDetails[0].areaM2 / 1_000_000).toFixed(2)}km
                <sup>2</sup>{" "}
              </>
            )}
          </p>
        )
      ) : (
        <p>
          Area: {(mainGlacierDetails.areaM2 / 1_000_000).toFixed(2)}km
          <sup>2</sup>
        </p>
      )}
    </div>
  );
}
