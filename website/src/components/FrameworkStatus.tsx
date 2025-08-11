import React, { useEffect, useState } from 'react';

interface FrameworkData {
  version: string;
  capabilityMap?: {
    totalCapabilities: number;
    categories: Record<string, any[]>;
    healthStatus: string;
  };
}

export default function FrameworkStatus() {
  const [data, setData] = useState<FrameworkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load framework data, fallback to static data if not available
    import('../../.docusaurus/aegis-data-generator/default/framework-data.json')
      .then(frameworkData => {
        setData(frameworkData.default);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to static data
        setData({
          version: '2.4.0',
          capabilityMap: {
            totalCapabilities: 64,
            categories: {
              Tool: Array(38).fill({}),
              Core: Array(20).fill({}),
              Governance: Array(4).fill({}),
              Integration: Array(2).fill({}),
            },
            healthStatus: 'healthy',
          },
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading framework status...</div>;
  }

  if (!data) {
    return <div>Framework status unavailable</div>;
  }

  const { capabilityMap } = data;

  return (
    <div
      style={{
        background: 'var(--ifm-color-emphasis-100)',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
      }}
    >
      <h3>📊 Current Framework Status</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
            v{data.version}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)' }}>Version</div>
        </div>

        {capabilityMap && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
                {capabilityMap.totalCapabilities}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)' }}>Capabilities</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
                {Object.keys(capabilityMap.categories).length}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)' }}>Categories</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--ifm-color-success)' }}>
                {capabilityMap.healthStatus === 'healthy' ? '✅' : '⚠️'}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)' }}>Health</div>
            </div>
          </>
        )}
      </div>

      {capabilityMap && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4>Category Breakdown:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {Object.entries(capabilityMap.categories).map(([category, capabilities]) => (
              <span
                key={category}
                style={{
                  background: 'var(--ifm-color-primary)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.9rem',
                }}
              >
                {category}: {capabilities.length}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
