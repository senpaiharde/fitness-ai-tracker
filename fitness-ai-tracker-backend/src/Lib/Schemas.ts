export const logUserEntrySchema = {
  name:        'logUserEntry',
  description: 'Structured daily entry',
  parameters: {
    type: 'object',
    properties: {
      workout: {
        type: 'object',
        properties: {
          type:     { type: 'string' },
          weightKg: { type: 'number' },
          reps:     { type: 'number' },
          time:     { type: 'string' }
        },
        required: ['type']
      },
      studyMinutes: { type: 'number' },
      foodPlan:     { type: 'string' },
      gaming: {
        type: 'object',
        properties: {
          game:    { type: 'string' },
          minutes: { type: 'number' },
          time:    { type: 'string' }
        }
      },
      injection: {
        type: 'object',
        properties: {
          compound: { type: 'string' },
          doseMg:   { type: 'number' },
          time:     { type: 'string' }
        }
      }
    }
  }
};
