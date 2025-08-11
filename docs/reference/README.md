<!--
@aegisFrameworkVersion: 2.5.0
@intent: Reference directory index and navigation
@context: Index for all framework reference documentation
@mode: strict
-->

# Reference Documentation

This directory contains reference documentation for the AI Agent Development Governance Framework.

## Available Reference Documents

### Framework Dashboard

**[FRAMEWORK-DASHBOARD.md](FRAMEWORK-DASHBOARD.md)**

Live status and monitoring dashboard for the framework. Provides:

- __Framework Health__ status and metrics
- __Capability Overview__ with all 64+ framework capabilities
- __Version Information__ and compatibility details
- __Performance Metrics__ and usage statistics
- __Constitutional Compliance__ monitoring

**Status__: Auto-Generated  
**Updated__: Real-time via framework observability system  
**Access__: Available at runtime via `Aegis-dashboard` command

## Reference Categories

### Technical Reference

- __API Documentation__: Complete API reference for all framework components
- __CLI Commands__: Full command-line interface documentation
- __Configuration Options__: All configuration parameters and settings
- __Error Codes__: Comprehensive error code reference and solutions

### Governance Reference

- __Constitutional Articles__: Complete Constitutional framework reference
- __Governance Rules__: All governance rules and enforcement mechanisms
- __Compliance Standards__: Framework compliance requirements and validation
- __Amendment Process__: Constitutional amendment and evolution procedures

### Pattern Reference

- __AI Code Patterns__: Complete catalog of available governance patterns
- __Pattern Schemas__: Technical specifications for pattern definitions
- __Validation Rules__: Pattern validation requirements and standards
- __Usage Examples__: Practical examples and implementation guides

## Quick Reference

### Essential Commands

```bash
# Framework status and health
Aegis-dashboard

# Constitutional compliance check
Aegis-conductor check

# Pattern validation
node tools/validate-Blueprint.ts patterns/pattern-name/pattern.YAML

# Real-time governance enforcement
Aegis-conductor enforce --real-time
```text

### Key Configuration Files

- __`CONSTITUTION.md`__: Framework governance charter
- __`patterns/*/pattern.YAML`__: AI code pattern definitions
- __`package.JSON`__: Framework version and dependencies
- __`VERSION`__: Current framework version

### Support Resources

- __[Getting Started Guide](../guide/getting-started.md)__: Quick start for new users
- __[Contributing Guide](../../CONTRIBUTING.md)__: How to contribute to the framework
- __[Specifications](../specifications/)__: Formal framework specifications
- __[Implementation Details](../implementation/)__: Technical implementation documentation

---

**Maintained by__: Framework Development Team  
**Auto-Generated Components__: Framework dashboard and metrics  
**Last Updated__: 2025-01-15  
**Next Review__: 2025-02-15
