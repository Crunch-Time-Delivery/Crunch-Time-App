// iotTopicRule.js
const { IoTClient, CreateTopicRuleCommand, UpdateTopicRuleCommand, DeleteTopicRuleCommand, DescribeTopicRuleCommand } = require("@aws-sdk/client-iot");

// Initialize the client
const client = new IoTClient({ region: "us-east-1" }); // replace with your region

// Create a topic rule
async function createTopicRule(ruleName, sql, actions, description = "") {
  const command = new CreateTopicRuleCommand({
    ruleName,
    topicRulePayload: {
      sql,
      actions,
      description,
      ruleDisabled: false,
    }
  });
  try {
    const result = await client.send(command);
    console.log("Topic rule created:", result);
  } catch (err) {
    console.error("Error creating topic rule:", err);
  }
}

// Update an existing topic rule
async function updateTopicRule(ruleName, sql, actions, description = "") {
  const command = new UpdateTopicRuleCommand({
    ruleName,
    topicRulePayload: {
      sql,
      actions,
      description,
      ruleDisabled: false,
    }
  });
  try {
    const result = await client.send(command);
    console.log("Topic rule updated:", result);
  } catch (err) {
    console.error("Error updating topic rule:", err);
  }
}

// Delete a topic rule
async function deleteTopicRule(ruleName) {
  const command = new DeleteTopicRuleCommand({ ruleName });
  try {
    const result = await client.send(command);
    console.log("Topic rule deleted:", result);
  } catch (err) {
    console.error("Error deleting topic rule:", err);
  }
}

// Describe a topic rule
async function describeTopicRule(ruleName) {
  const command = new DescribeTopicRuleCommand({ ruleName });
  try {
    const result = await client.send(command);
    console.log("Topic rule description:", result);
  } catch (err) {
    console.error("Error describing topic rule:", err);
  }
}

// Export functions
module.exports = {
  createTopicRule,
  updateTopicRule,
  deleteTopicRule,
  describeTopicRule
};