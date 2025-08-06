// CommonJS export for GhostMentor for CLI compatibility
class GhostMentor {
  provideFeedback({ answer }) {
    return `Ghost Mentor feedback: "${answer}" [auto-generated]`;
  }
}
module.exports = { GhostMentor };
