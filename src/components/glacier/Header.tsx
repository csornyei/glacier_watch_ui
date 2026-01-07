interface GlacierPageHeaderProps {
  mainGlacierDetails: {
    glacierName: string;
    areaM2: number;
  };
  compareGlacierDetails?: {
    glacierName: string;
    areaM2: number;
  };
}

export default function GlacierPageHeader({
  mainGlacierDetails,
  compareGlacierDetails,
}: GlacierPageHeaderProps) {
  const compare: boolean = compareGlacierDetails !== undefined;

  return (
    <div>
      <h2>{mainGlacierDetails.glacierName}</h2>
      {compare && <h3>Comparing with: {compareGlacierDetails!.glacierName}</h3>}
      <p>
        Area: {(mainGlacierDetails.areaM2 / 1_000_000).toFixed(2)}km
        <sup>2</sup>
        {compare && (
          <>
            &nbsp; | &nbsp;
            {(compareGlacierDetails!.areaM2 / 1_000_000).toFixed(2)}km
            <sup>2</sup>{" "}
          </>
        )}
      </p>
    </div>
  );
}
