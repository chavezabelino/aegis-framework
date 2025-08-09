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

- **Framework Health** status and metrics
- **Capability Overview** with all 64+ framework capabilities
- **Version Information** and compatibility details
- **Performance Metrics** and usage statistics
- **Constitutional Compliance** monitoring

**Status**: Auto-Generated  
**Updated**: Real-time via framework observability system  
**Access**: Available at runtime via `aegis-dashboard` command

## Reference Categories

### Technical Reference
- **API Documentation**: Complete API reference for all framework components
- **CLI Commands**: Full command-line interface documentation
- **Configuration Options**: All configuration parameters and settings
- **Error Codes**: Comprehensive error code reference and solutions

### Governance Reference
- **Constitutional Articles**: Complete constitutional framework reference
- **Governance Rules**: All governance rules and enforcement mechanisms
- **Compliance Standards**: Framework compliance requirements and validation
- **Amendment Process**: Constitutional amendment and evolution procedures

### Pattern Reference
- **AI Code Patterns**: Complete catalog of available governance patterns
- **Pattern Schemas**: Technical specifications for pattern definitions
- **Validation Rules**: Pattern validation requirements and standards
- **Usage Examples**: Practical examples and implementation guides

## Quick Reference

### Essential Commands
```bash
# Framework status and health
aegis-dashboard

# Constitutional compliance check
aegis-conductor check

# Pattern validation
node tools/validate-blueprint.ts patterns/pattern-name/pattern.yaml

# Real-time governance enforcement
aegis-conductor enforce --real-time
```

### Key Configuration Files
- **`CONSTITUTION.md`**: Framework governance charter
- **`patterns/*/pattern.yaml`**: AI code pattern definitions
- **`package.json`**: Framework version and dependencies
- **`VERSION`**: Current framework version

### Support Resources
- **[Getting Started Guide](../guide/getting-started.md)**: Quick start for new users
- **[Contributing Guide](../../CONTRIBUTING.md)**: How to contribute to the framework
- **[Specifications](../specifications/)**: Formal framework specifications
- **[Implementation Details](../implementation/)**: Technical implementation documentation

---

**Maintained by**: Framework Development Team  
**Auto-Generated Components**: Framework dashboard and metrics  
**Last Updated**: 2025-01-15  
**Next Review**: 2025-02-15
