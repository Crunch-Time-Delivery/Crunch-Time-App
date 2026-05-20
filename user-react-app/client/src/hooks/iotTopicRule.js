const {
  IoTClient,
  CreateTopicRuleCommand,
  UpdateTopicRuleCommand,
  DeleteTopicRuleCommand,
  DescribeTopicRuleCommand
} = require("@aws-sdk/client-iot");

// Initialize the AWS IoT client
const client = new IoTClient({ region: "us-east-1" }); // Replace with your region

// Create a topic rule
async function createTopicRule(ruleName, sql, actions, description = "") {
  if (!ruleName || !sql || !actions) {
    throw new Error("Missing required parameters for createTopicRule");
  }

  const command = new CreateTopicRuleCommand({
    ruleName,
    topicRulePayload: {
      sql,
      actions,
      description,
      ruleDisabled: false,
    },
  });

  try {
    const result = await client.send(command);
    console.log(`Topic rule "${ruleName}" created successfully:`, result);
    return result;
  } catch (err) {
    console.error(`Error creating topic rule "${ruleName}":`, err);
    throw err;
  }
}

// Update an existing topic rule
async function updateTopicRule(ruleName, sql, actions, description = "") {
  if (!ruleName || !sql || !actions) {
    throw new Error("Missing required parameters for updateTopicRule");
  }

  const command = new UpdateTopicRuleCommand({
    ruleName,
    topicRulePayload: {
      sql,
      actions,
      description,
      ruleDisabled: false,
    },
  });

  try {
    const result = await client.send(command);
    console.log(`Topic rule "${ruleName}" updated successfully:`, result);
    return result;
  } catch (err) {
    console.error(`Error updating topic rule "${ruleName}":`, err);
    throw err;
  }
}

// Delete a topic rule
async function deleteTopicRule(ruleName) {
  if (!ruleName) {
    throw new Error("Missing ruleName for deleteTopicRule");
  }

  const command = new DeleteTopicRuleCommand({ ruleName });

  try {
    const result = await client.send(command);
    console.log(`Topic rule "${ruleName}" deleted successfully.`);
    return result;
  } catch (err) {
    console.error(`Error deleting topic rule "${ruleName}":`, err);
    throw err;
  }
}

// Describe a topic rule
async function describeTopicRule(ruleName) {
  if (!ruleName) {
    throw new Error("Missing ruleName for describeTopicRule");
  }

  const command = new DescribeTopicRuleCommand({ ruleName });

  try {
    const result = await client.send(command);
    console.log(`Description for topic rule "${ruleName}":`, result);
    return result;
  } catch (err) {
    console.error(`Error describing topic rule "${ruleName}":`, err);
    throw err;
  }
}

// Export functions
module.exports = {
  createTopicRule,
  updateTopicRule,
  deleteTopicRule,
  describeTopicRule,
};