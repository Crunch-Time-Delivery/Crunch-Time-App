const {
  IoTClient,
  CreateTopicRuleCommand,
  UpdateTopicRuleCommand,
  DeleteTopicRuleCommand,
  DescribeTopicRuleCommand
} = require("@aws-sdk/client-iot");

// Initialize the IoT client with your region
const client = new IoTClient({ region: "us-east-1" }); // Replace with your region

/**
 * Creates a new IoT topic rule.
 * @param {string} ruleName - Name of the rule.
 * @param {string} sql - SQL statement for the rule.
 * @param {Array} actions - Array of actions for the rule.
 * @param {string} [description] - Optional description.
 */
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
    console.log("Topic rule created:", result);
    return result;
  } catch (err) {
    console.error(`Error creating topic rule "${ruleName}":`, err);
    throw err;
  }
}

/**
 * Updates an existing IoT topic rule.
 * @param {string} ruleName - Name of the rule.
 * @param {string} sql - SQL statement for the rule.
 * @param {Array} actions - Array of actions.
 * @param {string} [description] - Optional description.
 */
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
    console.log("Topic rule updated:", result);
    return result;
  } catch (err) {
    console.error(`Error updating topic rule "${ruleName}":`, err);
    throw err;
  }
}

/**
 * Deletes an IoT topic rule.
 * @param {string} ruleName - Name of the rule to delete.
 */
async function deleteTopicRule(ruleName) {
  if (!ruleName) {
    throw new Error("Missing ruleName for deleteTopicRule");
  }
  const command = new DeleteTopicRuleCommand({ ruleName });
  try {
    const result = await client.send(command);
    console.log("Topic rule deleted:", result);
    return result;
  } catch (err) {
    console.error(`Error deleting topic rule "${ruleName}":`, err);
    throw err;
  }
}

/**
 * Describes an IoT topic rule.
 * @param {string} ruleName - Name of the rule.
 */
async function describeTopicRule(ruleName) {
  if (!ruleName) {
    throw new Error("Missing ruleName for describeTopicRule");
  }
  const command = new DescribeTopicRuleCommand({ ruleName });
  try {
    const result = await client.send(command);
    console.log("Topic rule description:", result);
    return result;
  } catch (err) {
    console.error(`Error describing topic rule "${ruleName}":`, err);
    throw err;
  }
}

module.exports = {
  createTopicRule,
  updateTopicRule,
  deleteTopicRule,
  describeTopicRule,
};