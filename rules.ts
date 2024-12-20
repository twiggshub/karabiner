import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open, rectangle, shell } from "./utils";

const rules: KarabinerRules[] = [
  // Define the Hyper key itself
  {
    description: "Hyper Key (⌃⌥⇧⌘)",
    manipulators: [
      {
        description: "Caps Lock -> Hyper Key",
        from: {
          key_code: "caps_lock",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            set_variable: {
              name: "hyper",
              value: 1,
            },
          },
        ],
        to_after_key_up: [
          {
            set_variable: {
              name: "hyper",
              value: 0,
            },
          },
        ],
        to_if_alone: [
          {
            key_code: "escape",
          },
        ],
        type: "basic",
      },
      //      {
      //        type: "basic",
      //        description: "Disable CMD + Tab to force Hyper Key usage",
      //        from: {
      //          key_code: "tab",
      //          modifiers: {
      //            mandatory: ["left_command"],
      //          },
      //        },
      //        to: [
      //          {
      //            key_code: "tab",
      //          },
      //        ],
      //      },
    ],
  },
  ...createHyperSubLayers({
    // W = "Window Management" via rectangle.app and managing spaces
    w: {
        comma: { // Hide this Window
          description: "Hide Window",
          to: [
            { key_code: "h", modifiers: ["right_command"]}],
          },
        n: { // Next Window in selected Application (Rebind to another layer to make it work when editing text)
          description: "Next Application Window",
          to: [
            { key_code: "f1", modifiers: ["fn", "control"]}], // Please rebind it to Ctrl + F1 in Mac Settings
        }, 
        u: { // Previous Tab Retains the same VIM layout but only one top
          description: "Window: PrevTab/Apphistory",
          to: [{key_code: "tab",modifiers: ["right_control", "right_shift"]}],
          to_if_held_down: [{key_code: "open_bracket",modifiers: ["right_command"]}]
        },
        i: { // Next Tab 
          description: "Window: NextTab/AppHistory",
          to: [{ key_code: "tab",modifiers: ["right_control"]}],
          to_if_held_down: [{key_code: "close_bracket", modifiers: ["right_command"]}]
        },
        // My most common Rectangle shortcuts 
        m: rectangle("maximize"),
        h: rectangle("left-half"),
        l: rectangle("right-half"),
        r: rectangle("restore"),
        j: {
          description: "Press once for smaller, hold for faster smaller ",
          to: [{shell_command: `open -g rectangle://execute-action?name=smaller`}], // Assumes that right arrow and ctrl is to change space 
          to_if_held_down: [{shell_command: `open -g rectangle://execute-action?name=smaller`}],}, // Just stripped this directly, too lazy to figure out how  to do it properly
        k: {
          description: "Press once for smaller, hold for faster smaller ",
          to: [{shell_command: `open -g rectangle://execute-action?name=larger`}], // Assumes that right arrow and ctrl is to change space 
          to_if_held_down: [{shell_command: `open -g rectangle://execute-action?name=larger`}],}, // Just stripped this directly, too lazy to figure out how  to do it properly
        t: rectangle("enable-todo-mode"),
        c: {
          description: "Hold for space, press for display",
          to: [{shell_command: `open -g rectangle://execute-action?name=center`}], // Assumes that right arrow and ctrl is to change space 
          to_if_held_down: [{shell_command: `open -g rectangle://execute-action?name=center-half`}]},
        down_arrow: rectangle("smaller"),
        up_arrow: rectangle("bigger"),

    // Select and grab windows between displays and spaces
        // Spacebar acts as a "Grab" button for whereever the mouse is at. 
        // To enable this functionality enter `defaults write -g NSWindowShouldDragOnGesture -bool true` 
        // to disable this functionality enter defaults delete -g NSWindowShouldDragOnGestured
        spacebar: {   
          description: "Spaces: selected window is grabbed",
          to: [
            {pointing_button: "button1", modifiers: ["left_control", "left_command"],},],},
          o: {
            description: "Hold for space, press for display",
            to: [{ key_code: "right_arrow", modifiers: ["left_control"]}], // Assumes that right arrow and ctrl is to change space 
            to_if_held_down: [{shell_command: `open -g rectangle://execute-action?name=next-display`}]},
          y: {
            description: "Hold for space, press for display",
            to: [{ key_code: "left_arrow", modifiers: ["left_control"]}], // Assumes that right arrow and ctrl is to change space 
            to_if_held_down: [{shell_command: `open -g rectangle://execute-action?name=previous-display`}]}, // Just stripped this directly, too lazy to figure out how  to do it properly
    
        },
    // (moVe) No literal connection, just in case I need to focus on a specific window 
    v: {
      d: {
        description: "Move focus to the Dock", // D for dock
        to: [{ key_code: "f3",  modifiers: ["right_control", "fn"]}],
      },
      m: {
        description: "Move focus to the menu Bar", // M for menu
        to: [{ key_code: "f2",  modifiers: ["right_control", "fn"]}],
      },
      s: {
        description: "Move focus to the Status bar", // S for status bar
        to: [{ key_code: "f8",  modifiers: ["right_control", "fn"]}],
      },
      f: { // F to floating window
        description: "Move focus to the Floating Window",
        to: [{ key_code: "f6",  modifiers: ["right_control", "fn"]}],
      },
      a: {
        description: "Move focus to the Active or Next Window", // A for acive window
        to: [{ key_code: "f4",  modifiers: ["right_control", "fn"]}],
      },
      n: {
        description: "Move focus to the Next Window", //Next window 
        to: [{ key_code: "f1",  modifiers: ["right_control", "fn"]}],
      },
      w: {
        description: "Move focus to the Window toolbar (Of the active window)", // W for window
        to: [{ key_code: "f5",  modifiers: ["right_control", "fn"]}],
      }, 
    },
    // Second brain commands
    b: {
      l: open("'obsidian://adv-uri?vault=BranBrain&commandid=quickadd%3Achoice%3A0fda55af-9abe-480a-9b5b-766125f2c11a'"), // L tasks
      j: open("'obsidian://adv-uri?vault=BranBrain&commandid=quickadd%3Achoice%3A9c6cd56b-99fe-46be-a419-c94266cb2c3b'"), // journal
      k: open("'obsidian://adv-uri?vault=BranBrain&commandid=quickadd%3ArunQuickAdd'"), // K-quick add
      h: open("'obsidian://adv-uri?vault=BranBrain&uid=46af0d9e-8185-4dcd-b628-cadbf28deee1&commandid=workspace%3Aopen-in-new-window'"), // Opens my homepage in a new window
      t: open("'obsidian://adv-uri?vault=BranBrain&uid=a3c2bfd5-5844-4a43-a884-e8237facad5a&commandid=workspace%3Aopen-in-new-window'"), // Opens my homepage in a new window
      
    },
    // (O)pen applications layer
    o: {
      i: app("WhatsApp"),
      c: app("Calendar"),
      t: app("Terminal"),
      w: app("Zen Browser"),
      d: app("Discord"),
      comma: app("System Settings"),
      f: app("Finder"),
      y: app("YouTube Music"),
      v: app("Visual Studio Code"),
      b: app("Obsidian"),
      g: app("ChatGPT"),
      //todo: scripts to execute obs and maybe even if I find it, remote
    },
    // 
    u: {
        a: { // (A)ssistant -Siri
          to: [{key_code: "s", modifiers: ["fn"] }], // binds to the default globe/fn+s to open Siri
        },
        7: {
          to: [{key_code: "display_brightness_decrement"}], // Default bind F14 to  brightness down. 
        },
        8: {
          to: [{key_code: "display_brightness_increment"}], // Default bind F15 to brightness up
        },
        k: {
          to: [
            {
              key_code: "volume_increment",
            },
          ],
        },
        j: {
          to: [
            {
              key_code: "volume_decrement",
            },
          ],
        },
        p: {
          to: [
            {
              key_code: "play_or_pause",
            },
          ],
        },
        // l: { 
        //   to_if_held_down: [
        //     {
        //       key_code: "fastforward",
        //     },
        //   ],
        // },

        d: { // Dictation
          to: [{key_code: "f5", modifiers: ["option", "fn"]}], // activates the dicatation feature in macos
        },
        
     //  open(`raycast://extensions/raycast/system/toggle-system-appearance`), // (T)heme
      
    },

  // A(rrow Layer)
    a: {
      h: {
        to: [{ key_code: "left_arrow" }],
      },
      j: {
        to: [{ key_code: "down_arrow" }],
      },
      k: {
        to: [{ key_code: "up_arrow" }],
      },
      l: {
        to: [{ key_code: "right_arrow" }],
      },
      s: { // (S)elect from text
        to: [{ key_code: "left_shift" }],
       },        
       u: {
           to: [{ key_code: "end" }],
         },
       i: {
         to: [{ key_code: "home" }],
       },
       m: {
         to: [{ key_code: "page_down" }],
       },
       comma: {
         to: [{ key_code: "page_up" }],
       },
      },
  // S = Mou(S)e layers
    s: {
    h: {
      to: [{ mouse_key: { "x": -512 } }],
      to_if_held_down: [{ mouse_key: { "x": -1024 } }] // Value doubled for `to_if_held`
    },
    j: {
      to: [{ mouse_key: { "y": 512 } }], // Adjusts for inverted settings if enabled
      to_if_held_down: [{ mouse_key: { "y": 1024 } }] // Value doubled for `to_if_held`
    },
    k: {
      to: [{ mouse_key: { "y": -512 } }],
      to_if_held_down: [{ mouse_key: { "y": -1024 } }] // Value doubled for `to_if_held`
    },
    l: {
      to: [{ mouse_key: { "x": 512 } }],
      to_if_held_down: [{ mouse_key: { "x": 1024 } }] // Value doubled for `to_if_held`
    },
    return: {
      to: [{ pointing_button: "button1" }],
      to_if_held_down: [{ pointing_button: "button2", modifiers: ["control"]}],
    },
    spacebar: {
      to: [{ pointing_button: "button1" }],
      to_if_held_down: [{ pointing_button: "button2", modifiers: ["control"]}],
    },
    u: {
      to: [{mouse_key:{"vertical_wheel": 72}}],
      to_if_held_down: [{mouse_key:{"vertical_wheel": 96}}],
    },
    i: {
      to: [{mouse_key:{"vertical_wheel": -72}}], 
      to_if_held_down: [{mouse_key:{"vertical_wheel": -96}}],
    },
    m: {
      to: [{ key_code: "page_down" }],
    },
    comma: {
      to: [{ key_code: "page_up" }],
    },
    c:{ // Opens shortcat.apps shortcut  CAT 
        to: [{ key_code: "spacebar", modifiers: ["left_command", "left_shift"]}],
       }, 
    f: { // Superkey Find 
         to: [{key_code: "f13"}], // binds F13 to superkey's seek
        },
      }, 


  // C for Numpad Layers
  
    c: {
      j: {
          to: [{ key_code: "keypad_4" }],
      },
      k: {
          to: [{ key_code: "keypad_5" }],
      },
      l: {
          to: [{ key_code: "keypad_6" }],
      },
      spacebar: {
        to: [{ key_code: "keypad_0" }],
      },
      m: {
          to: [{ key_code: "keypad_1" }],
      },
      comma: {
          to: [{ key_code: "keypad_2" }],
      },
      period: {
          to: [{ key_code: "keypad_3" }],
      },
      b: {
          to: [{ key_code: "keypad_0" }],
      },
      n: {
          to: [{ key_code: "keypad_period" }],
      },
      u: {
          to: [{ key_code: "keypad_7" }],
      },
      i: {
          to: [{ key_code: "keypad_8" }],
      },
      o: {
          to: [{ key_code: "keypad_9" }],
      },
      // "7": {
      //     to: [{ key_code: "keypad_num_lock" }],
      // },
      8: {
          to: [{ key_code: "keypad_slash" }],
      },
      9: {
          to: [{ key_code: "keypad_asterisk" }],
      },
      0: {
          to: [{ key_code: "keypad_hyphen" }],
      },
      p: {
          to: [{ key_code: "keypad_plus" }],
      },
      semicolon: {
          to: [{ key_code: "keypad_enter" }],
      },
      }

    // Spacebar for common shortcut layers 
  }),
  ];
//           // },
//           // v: { // Mo(v)e around Layers 
//           //   description: "Window: Hide",
//           //   to: [
//           //     { key_code: "h", modifiers: ["right_command"]}],
//           //   },
//           // s: { //  (S)ize and Move Windows
//           //   j: rectangle("bottom-half"),
//           //   k: rectangle("top-half"),
//           //   h: rectangle("left-half"),
//           //   l: rectangle("right-half"),
//           //   m: rectangle("maximize"),
//           //   spacebar: { // To enable this functionality enter `defaults write -g NSWindowShouldDragOnGesture -bool true` 
//           //     // to disable this functionality enter defaults delete -g NSWindowShouldDragOnGestured
//           //     description: "Spaces: selected window is grabbed",
//           //     to: [
//           //       {
//           //         pointing_button: "button1",
//           //         modifiers: ["left_control", "left_command"],
//           //       },
//           //     ],
//           //   },
//           //   },
//       // Note: I set rectangle.app to cycle sizes.

//       // y: rectangle("previous-display"),
//       // o: rectangle("next-display"),
//       // k: rectangle("top-half"),
//       // c: rectangle("center"),
//       // d: rectangle("center-half"),
//       // g: rectangle("smaller"),
//       // v: rectangle("bigger"),
//       // j: rectangle("bottom-half"),
//       // h: rectangle("left-half"),
//       // l: rectangle("right-half"),
//       // f: rectangle("maximize"),
//       // to-do, I can move windows between spaces if I hypothetically:
//       // could drag/select the active window and then switch a space. but idk how to do that yet
//       // u: {
//       //   description: "Window: Previous Tab",
//       //   to: [
//       //     {
//       //       key_code: "tab",
//       //       modifiers: ["right_control", "right_shift"],
//       //     },
//       //   ],
//       // },
//       // i: {
//       //   description: "Window: Next Tab",
//       //   to: [
//       //     {
//       //       key_code: "tab",
//       //       modifiers: ["right_control"],
//       //     },
//       //   ],
//       // },
//       // // Spaces control
//       // 7: {
//       //   description: "Spaces: Switch Left",
//       //   to: [
//       //     {
//       //       key_code: "left_arrow",
//       //       modifiers: ["left_control"],
//       //     },
//       //   ],
//       // },
//       // Todo - 8 to grab and move space right or left

//       8: { // To enable this functionality enter `defaults write -g NSWindowShouldDragOnGesture -bool true` 
//         // to disable this functionality enter defaults delete -g NSWindowShouldDragOnGestured
//         description: "Spaces: selected window is grabbed",
//         to: [
//           {
//             pointing_button: "button1",
//             modifiers: ["left_control", "left_command"],
//           },
//         ],
//       },
//       9: {
//         description: "Spaces: Switch Right",
//         to: [
//           {
//             key_code: "right_arrow",
//             modifiers: ["left_control"],
//           },
//         ],
//       },
//       n: {
//         description: "Window: Next Window",
//         to: [
//           {
//             key_code: "equal_sign",
//             modifiers: ["right_command", "right_shift"],
//           },
//         ],
//       },
//       p: {
//         //to-solve: need to remove the hide which happens when 
//         // one does cmd caps h 
//         description: "Window: Back",
//         to: [
//           {
//             key_code: "open_bracket",
//             modifiers: ["right_command"],
//           },
//         ],
//       },
//       // Note: No literal connection. Both f and n are already taken. ForeGround 
//       0: {
//         description: "Window: Forward",
//         to: [
//           {
//             key_code: "close_bracket",
//             modifiers: ["right_command"],
//           },
//         ],
//     },
//     },

//     // DEFUNCT:
//     // (Q)uery for clickable stuff in shortcatapp.2 
//     // q: {
//     //   description: "Open shortcat2.app",
//     //   to: [
//     //     {
//     //       software_function: {
//     //         open_application: {

//     //         }
//     //       },
//     //     },
//     //   ],
//     // },
// // Spacebar for utilities 
// spacebar: {
//   j:{
//    to: [{ key_code: "spacebar", modifiers: ["left_command", "left_shift"]}],
//   }, 
//   f: { // Superkey Find 
//     to: [{key_code: "f13"}], // binds F13 to superkey's seek
//    },
//    a: { // Assistantz
//      to: [{key_code: "s", modifiers: ["fn"] }], // binds to the default globe/fn+s to open Siri
//    },
//    7: {
//      to: [{key_code: "display_brightness_decrement"}], // Default bind F14 to  brightness down. 
//    },
//    8: {
//      to: [{key_code: "display_brightness_increment"}], // Default bind F15 to brightness up
//    }, 
// //  open(`raycast://extensions/raycast/system/toggle-system-appearance`), // (T)heme
//  d: {
//    to: [{key_code:"dictation"}], // activates the dicatation feature in macos
//  },
// },
//     // ( O ) open files
//     o: {
//      w: app("WhatsApp"),
//      c: app("Calendar"),
//      t: app("Terminal"),
//      e: app("Zen Browser"),
//      d: app("Discord"),
//      comma: app("System Settings"),
//      f: app("Finder"),
//      y: app("YouTube Music"),
//      v: app("Visual Studio Code"),
//     //  e: app("Mail"),
//      b: app("Obsidian"), //opens obsidian in general
//     },
//     // Edit second B-rain 
//     // to open these in firefox you need to go to about:config and set "security.external_protocol_requires_permission" to false 
//     b: {
//       // opens Obsidian Journaling (E)ntry menu
//       j: open(`obsidian://adv-uri?vault=BranBrain&commandid=quickadd%3Achoice%3A9c6cd56b-99fe-46be-a419-c94266cb2c3b`),
//       // (T)ask modal 
//       l: open(`obsidian://adv-uri?vault=BranBrain&commandid=quickadd%3Achoice%3A0fda55af-9abe-480a-9b5b-766125f2c11a`),
//       // Obsidian Homepage
//       h: open(`obsidian://adv-uri?vault=BranBrain&uid=46af0d9e-8185-4dcd-b628-cadbf28deee1`),
//       // Opens obsidians (Q)uick-Add modal
//       q: open(`obsidian://adv-uri?vault=BranBrain&commandid=quickadd%3ArunQuickAdd`),
//     }, 
//     // A = arrow layer, so that hjkl works like it in VIM
//     a: {
//       h: {
//         to: [{ key_code: "left_arrow" }],
//       },
//       j: {
//         to: [{ key_code: "down_arrow" }],
//       },
//       k: {
//         to: [{ key_code: "up_arrow" }],
//       },
//       l: {
//         to: [{ key_code: "right_arrow" }],
//       },
//       s: { // (S)elect from text
//        to: [{ key_code: "left_shift" }],
//       },        
//       u: {
//           to: [{ key_code: "end" }],
//         },
//       i: {
//         to: [{ key_code: "home" }],
//       },
//       m: {
//         to: [{ key_code: "page_down" }],
//       },
//       comma: {
//         to: [{ key_code: "page_up" }],
//       },
//     },
//     // S = Mou(S)e layers (yeah i ain't ot no excuse here)
//       s: {
//         h: {
//           to: [{mouse_key:{"x": -512}}],
//         },
//         j: {
//           to: [{mouse_key:{"y": 512}}], // note that if inverted settinsg are on these too are inverted.
//         },
//         k: { 
//           to: [{mouse_key:{"y": -512}}],
//         },
//         // TO:DO -- find a way to turn J and K into mouse_wheel_scroll
//         l: {
//           to: [{mouse_key:{"x": 512}}],
//           // to: [{ key_code: "f", modifiers: ["right_control"]}],
//         },
//         spacebar: {
//               to: [{ pointing_button: "button1" }],
//               to_if_held_down: [{ pointing_button: "button2" }],
//             },
//         u: {
//           to: [{mouse_key:{"vertical_wheel": 96}}],
//         },
//         i: {
//           to: [{mouse_key:{"vertical_wheel": -96}}], 
//         },
//         m: {
//           to: [{ key_code: "page_down" }],
//         },
//         comma: {
//           to: [{ key_code: "page_up" }],
//         },
//       },
//       // (X)tra settings for settings layer like in many macos apps. 
//       // C for calculation/numpad for numpad layer, no literal connection
//       c: {
//         j: {
//             to: [{ key_code: "keypad_4" }],
//         },
//         k: {
//             to: [{ key_code: "keypad_5" }],
//         },
//         l: {
//             to: [{ key_code: "keypad_6" }],
//         },
//         spacebar: {
//           to: [{ key_code: "keypad_0" }],
//         },
//         m: {
//             to: [{ key_code: "keypad_1" }],
//         },
//         comma: {
//             to: [{ key_code: "keypad_2" }],
//         },
//         period: {
//             to: [{ key_code: "keypad_3" }],
//         },
//         b: {
//             to: [{ key_code: "keypad_0" }],
//         },
//         n: {
//             to: [{ key_code: "keypad_period" }],
//         },
//         u: {
//             to: [{ key_code: "keypad_7" }],
//         },
//         i: {
//             to: [{ key_code: "keypad_8" }],
//         },
//         o: {
//             to: [{ key_code: "keypad_9" }],
//         },
//         // "7": {
//         //     to: [{ key_code: "keypad_num_lock" }],
//         // },
//         8: {
//             to: [{ key_code: "keypad_slash" }],
//         },
//         9: {
//             to: [{ key_code: "keypad_asterisk" }],
//         },
//         0: {
//             to: [{ key_code: "keypad_hyphen" }],
//         },
//         p: {
//             to: [{ key_code: "keypad_plus" }],
//         },
//         semicolon: {
//             to: [{ key_code: "keypad_enter" }],
//         },
 
    
     //Todo: Another layer for text manipulation only 
        // t: {
        //   i: {
        //     to: [{mouse_key:{"vertical_wheel": -96}}], 
        //   },
        // },
 
        // // Space to click (specified amount of itmes) hold for context menu on cursor
        // spacebar: {
        //   description: "Space to click (specified amount of itmes) hold for context menu on cursor",
        //   manipulators: [
        //     
        //       description: "If Space Click then Click",
        //       key_code: "spacebar",
        //     }
      // // Pointer actions using A (Right Click and F (Left Click)   
      // s: {
      //   d: {
      //     to: [{ key_code: "j", modifiers: ["right_control"] }],
      //   },
      //   f: {
      //     to: [{ pointing_button: "button1"}],
      //   },
      //   u: {
      //     to: [{ key_code: "page_down" }],
      //   },
      //   i: {
      //     to: [{ key_code: "page_up" }],
      //   },
      // }   

fs.writeFileSync(
  "karabiner.json",
  JSON.stringify(
    {
      global: {
        show_in_menu_bar: false,
      },
      profiles: [
        {
          name: "Default",
          complex_modifications: {
            rules,
          },
        },
      ],
    },
    null,
    2
  )
);
