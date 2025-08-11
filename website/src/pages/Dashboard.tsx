import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './Dashboard.module.css';

interface FrameworkData {
  capabilityMap?: {
    frameworkVersion: string;
    totalCapabilities: number;
    categories: Record<string, any[]>;
    healthStatus: string;
  };
  blueprintRegistry?: {
    totalBlueprints: number;
    blueprints: any[];
  };
  version: string;
}

function CapabilityChart({ categories }: { categories: Record<string, any[]> }) {
  const total = Object.values(categories).reduce((sum, caps) => sum + caps.length, 0);

  return (
    <div className={styles.chartContainer}>
      <h3>Capability Distribution</h3>
      {Object.entries(categories).map(([category, capabilities]) => {
        const percentage = Math.round((capabilities.length / total) * 100);
        return (
          <div key={category} className={styles.chartBar}>
            <div className={styles.chartLabel}>
              <span className={styles.categoryIcon}>{getCategoryIcon(category)}</span>
              <span>{category}</span>
              <span className={styles.count}>{capabilities.length}</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
            </div>
            <span className={styles.percentage}>{percentage}%</span>
          </div>
        );
      })}
    </div>
  );
}

function StatusCard({
  title,
  value,
  status,
  icon,
}: {
  title: string;
  value: string | number;
  status: 'healthy' | 'warning' | 'error';
  icon: string;
}) {
  return (
    <div className={`${styles.statusCard} ${styles[status]}`}>
      <div className={styles.cardIcon}>{icon}</div>
      <div className={styles.cardContent}>
        <h4>{title}</h4>
        <div className={styles.cardValue}>{value}</div>
      </div>
    </div>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    core: '🏛️',
    tool: '🔧',
    governance: '⚖️',
    integration: '🔗',
    experimental: '🧪',
  };
  return icons[category.toLowerCase()] || '📦';
}

function getHealthStatus(status: string): 'healthy' | 'warning' | 'error' {
  switch (status) {
    case 'healthy':
      return 'healthy';
    case 'warnings':
      return 'warning';
    default:
      return 'error';
  }
}

export default function Dashboard() {
  const { siteConfig } = useDocusaurusContext();
  const [frameworkData, setFrameworkData] = useState<FrameworkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load framework data
    import('../../.docusaurus/aegis-data-generator/default/framework-data.json')
      .then(data => {
        setFrameworkData(data.default);
        setLoading(false);
      })
      .catch(error => {
        console.warn('Failed to load framework data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Layout title="Dashboard" description="Live Aegis Framework Dashboard">
        <div className={styles.container}>
          <div className={styles.loading}>Loading framework data...</div>
        </div>
      </Layout>
    );
  }

  if (!frameworkData) {
    return (
      <Layout title="Dashboard" description="Live Aegis Framework Dashboard">
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Framework Data Unavailable</h2>
            <p>Unable to load live framework data. Please ensure the framework is properly configured.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const { capabilityMap, blueprintRegistry } = frameworkData;

  return (
    <Layout title="Dashboard" description="Live Aegis Framework Dashboard">
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>🏛️ Aegis Framework Dashboard</h1>
          <p className={styles.subtitle}>Live framework status and capability overview</p>
        </header>

        {capabilityMap && (
          <>
            <section className={styles.statusSection}>
              <h2>Framework Overview</h2>
              <div className={styles.statusGrid}>
                <StatusCard title="Version" value={`v${capabilityMap.frameworkVersion}`} status="healthy" icon="🏷️" />
                <StatusCard title="Capabilities" value={capabilityMap.totalCapabilities} status="healthy" icon="🔧" />
                <StatusCard
                  title="Categories"
                  value={Object.keys(capabilityMap.categories).length}
                  status="healthy"
                  icon="📋"
                />
                <StatusCard
                  title="Health"
                  value={capabilityMap.healthStatus.toUpperCase()}
                  status={getHealthStatus(capabilityMap.healthStatus)}
                  icon={capabilityMap.healthStatus === 'healthy' ? '✅' : '⚠️'}
                />
              </div>
            </section>

            <section className={styles.chartSection}>
              <CapabilityChart categories={capabilityMap.categories} />
            </section>

            <section className={styles.categoriesSection}>
              <h2>Capability Categories</h2>
              <div className={styles.categoriesGrid}>
                {Object.entries(capabilityMap.categories).map(([category, capabilities]) => (
                  <div key={category} className={styles.categoryCard}>
                    <div className={styles.categoryHeader}>
                      <span className={styles.categoryIcon}>{getCategoryIcon(category)}</span>
                      <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                    </div>
                    <div className={styles.categoryCount}>{capabilities.length} capabilities</div>
                    <div className={styles.categoryActions}>
                      <a href={`/docs/capabilities/${category}`} className="button button--primary button--sm">
                        Explore {category}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {blueprintRegistry && (
          <section className={styles.blueprintsSection}>
            <h2>Blueprint Registry</h2>
            <div className={styles.blueprintStats}>
              <StatusCard
                title="Total Blueprints"
                value={blueprintRegistry.totalBlueprints || blueprintRegistry.blueprints?.length || 0}
                status="healthy"
                icon="📋"
              />
            </div>
          </section>
        )}

        <section className={styles.actionsSection}>
          <h2>Quick Actions</h2>
          <div className={styles.actionButtons}>
            <a href="/docs/intro" className="button button--primary">
              📖 Get Started
            </a>
            <a href="/docs/capabilities" className="button button--secondary">
              🔧 Browse Capabilities
            </a>
            <a href="/docs/blueprints" className="button button--secondary">
              📋 View Blueprints
            </a>
            <a href="https://github.com/your-username/aegis-framework" className="button button--outline">
              💻 GitHub Repository
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}
