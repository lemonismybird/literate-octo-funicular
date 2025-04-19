// @name: RCP Command
// @description: Adds a command to set custom Rich Presence on mobile.
// @author: YourName
// @version: 1.0

const { React, FluxDispatcher, Users } = await vendetta.metro;
const { findByProps } = vendetta.metro.common;
const { showToast } = findByProps("showToast");
const { create } = findByProps("createCommand");
const { openModal } = findByProps("openModal");
const { Modal, Forms, TextInput } = vendetta.metro.components;

// Discord's internal presence utilities (may vary by client version)
const PresenceUtils = findByProps("setLocalPresence");
const ApplicationAssetUtils = findByProps("fetchAssetIds");

// Register the command
function registerRCPCommand() {
  create({
    name: "rcp",
    description: "Set a custom Rich Presence",
    options: [
      {
        name: "details",
        description: "Primary text (e.g., 'Playing XYZ')",
        required: true,
        type: 3, // String type
      },
      {
        name: "state",
        description: "Secondary text (e.g., 'Level 100')",
        required: false,
        type: 3,
      },
      {
        name: "large_image",
        description: "Asset key for large image",
        required: false,
        type: 3,
      },
    ],
    execute: async (args, ctx) => {
      const details = args.find(a => a.name === "details")?.value;
      const state = args.find(a => a.name === "state")?.value;
      const largeImage = args.find(a => a.name === "large_image")?.value;

      // Validate input
      if (!details) {
        showToast("Details are required!", "error");
        return;
      }

      // Set the presence
      try {
        await PresenceUtils.setLocalPresence({
          activities: [{
            name: "Custom",
            type: 0, // Playing
            details,
            state,
            assets: {
              large_image: largeImage || "default_image_key",
            },
            timestamps: { start: Date.now() },
          }],
          status: "online",
        });
        showToast("Rich Presence Updated!", "success");
      } catch (e) {
        showToast("Failed to set RCP: " + e.message, "error");
      }
    },
  });
}

// Unregister on plugin stop
export function onUnload() {
  const { deleteCommand } = findByProps("deleteCommand");
  deleteCommand("rcp");
}

// Initialize
registerRCPCommand();
