# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository and the broader development environment at B:\.

## Project Environment Overview

This is a **multi-disciplinary creative technology development environment** spanning game development, AI integration, web visualization, and creative tools. The workspace contains multiple interconnected projects across different technology stacks.

### Primary Project Categories

**🎮 Game Development:**
- Unity projects (C#, XR/VR, mobile AR)
- Rust/Bevy game projects (underwater games, simulations)
- Unreal Engine 5.5 projects

**🌐 Web & Visualization:**
- Three.js Langton's Ant 3D visualization (this project)
- Interactive web experiences with TypeScript/JavaScript

**🤖 AI & Machine Learning:**
- Local AI model deployment (Ollama, Qwen)
- AI-powered creative tools (Tripo 3D modeling)

**🎨 Creative & Design:**
- Blender 3D modeling and animation
- Affinity Designer projects
- DaVinci Resolve video production

**⚙️ Desktop Applications:**
- FileConverter (C# .NET with Windows integration)
- Various Python utilities and tools

### Key Architectural Patterns

**System-Based Architecture**: Modular design with centralized communication (prominent in Langton's Ant)
**Event-Driven Communication**: Decoupled systems using event buses
**Cross-Platform Development**: Multiple deployment targets and platforms
**Data Visualization Focus**: Emphasis on 3D mathematical and algorithmic visualization

## Development Commands

### Langton's Ant Three.js Project (Current Directory)

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Code quality
npm run lint          # Check for linting issues
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code with Prettier

# Generate project documentation
npm run snapshot
```

### Other Project Environments

**Unity Projects:**
```bash
# Open Unity project
# Navigate to B:\unity\Unity_Project\[project-name] and open .unity file
```

**Rust/Bevy Projects:**
```bash
# Navigate to B:\Sal_program\Underwater\Rust\[project-name]
cargo run
cargo build
```

**FileConverter (.NET):**
```bash
# Navigate to B:\work_software\FileConverter
dotnet run
dotnet build
```

**AI Projects (Ollama):**
```bash
# Navigate to B:\Ollama
ollama serve          # Start local AI server
ollama pull [model]   # Download AI models
```

## High-Level Architecture

### Langton's Ant Three.js Project (Current Project)

This is a **3D Langton's Ant visualization project** built with Three.js and TypeScript. The application renders the mathematical algorithm's path as an interactive 3D visualization with advanced visual effects. This project serves as a reference implementation of the system-based modular architecture used throughout the development environment.

### Core Architecture Pattern

The project follows a **system-based modular architecture** with a centralized event bus for inter-system communication:

1. **Central Application** (`src/main.ts`) - Manages initialization and lifecycle
2. **Event Bus** (`src/event-bus.ts`) - Decoupled system communication
3. **Configuration Manager** (`src/config.ts`) - Centralized state management
4. **18 Independent Systems** - Modular functionality units
5. **UI Layer** - Tweakpane-based control interfaces

### Key Systems Organization

**Core Rendering Systems:**
- `coordinates-sys.ts` - Unified coordinate space management
- `path-sys.ts` - Ant trajectory visualization (main feature)
- `camera-sys.ts` - 3D camera controls and navigation
- `postprocess-sys.ts` - Bloom, depth of field, chromatic aberration
- `material-sys.ts` - Custom shaders and material management

**Visual Effects Systems:**
- `particles-sys.ts` - Ambient particle effects
- `lighting-sys.ts` - Dynamic scene lighting
- `visual-effects-sys.ts` - Rocket jitter, flames, exhaust effects
- `animation-sys.ts` - TWEEN.js-driven animations

**Data & Content Systems:**
- `data-sys.ts` - CSV data loading and parsing
- `model-sys.ts` - 3D model management
- `environment-sys.ts` - Skybox and atmospheric effects
- `audio-sys.ts` - Sound management

**Scene Management:**
- `scene-director-sys.ts` - Scene composition control
- `light-sys.ts` - Moving light source along path

### Data Flow Pattern

The application uses **event-driven architecture** with unidirectional data flow:

1. **Config Changes** → `config-changed` event → System updates
2. **User Interactions** → UI events → System responses
3. **Data Loading** → CSV parsing → Path generation → Visual updates
4. **Animation Loop** → System updates → Render calls

### Coordinate System Hierarchy

All 3D objects are organized under a unified coordinate system:
```
Scene
├── worldRoot
│   ├── dataSpace (scaled/rotated data space)
│   │   ├── pathAnchor (path visualization)
│   │   ├── lightAnchor (moving lights)
│   │   └── particleAnchor (particle systems)
```

### CSV Data Structure

The ant movement data follows this format:
```csv
step,x,y,z,color,direction
0,0,0,0,0,0
1,-1,0,-1,0,4
```

### Configuration System

The config system uses **dot notation** for nested access:
```typescript
config.get('sceneComposition.active')  // Get current scene
config.set('animation.speedFactor', 0.1)  // Update animation speed
```

Config changes automatically trigger `config-changed` events that systems listen to.

### Scene Composition System

Scenes are composed of multiple visual components:
```typescript
compositions: {
  modelAnt: [
    { type: 'math-path', enabled: true },
    { type: 'model-light', enabled: true },
    { type: 'particle-dust', enabled: true }
  ]
}
```

### Development Notes

- **TypeScript Migration**: The project is gradually migrating to TypeScript - some files may still be `.js`
- **Performance Focus**: Uses drawRange optimization for path rendering, efficient particle systems
- **Visual Effects Pipeline**: Post-processing effects chain can be enabled/disabled individually
- **Preset System**: Configurations can be saved/loaded via `presetManager`
- **Logger System**: Uses `src/utils/logger.ts` with throttling to prevent console spam

### File Organization

```
src/
├── main.ts              # Application entry point
├── event-bus.ts         # System communication
├── config.ts            # Global configuration
├── preset-manager.ts    # Preset management
├── core/                # (Planned core classes)
├── systems/             # 18 modular systems
├── ui/                  # UI components
├── utils/               # Utilities (logger, helpers)
├── types/               # TypeScript definitions
├── shaders/             # GLSL shader files
└── renderers/           # Custom renderers
```

### Build Configuration

- **Vite** for development and building
- **Production base path**: `/LangtonAnt3D_dist/` (configured in `vite.config.ts`)
- **TypeScript strict mode** enabled
- **ESLint + Prettier** for code quality

The project deploys to a separate repository's gh-pages branch - after building, copy `dist/` contents to the `LangtonAnt3D_dist` folder.

---

## Broader Development Environment

### Technology Stack Summary

**Core Technologies:**
- **C# (.NET)**: Unity projects, FileConverter desktop application
- **C++**: Unreal Engine development
- **Rust**: Bevy game engine projects, system programming
- **TypeScript/JavaScript**: Three.js, web development
- **Python**: AI tools, utilities, automation scripts

**Game Engines:**
- **Unity**: XR/VR projects, mobile AR templates, game prototypes
- **Unreal Engine 5.5**: High-fidelity game development
- **Bevy (Rust)**: Entity-component-system game architecture

**Creative & Design Tools:**
- **Blender**: 3D modeling, animation, rendering
- **Affinity Designer**: 2D design, vector graphics
- **DaVinci Resolve**: Video editing, color grading

**AI & Data Processing:**
- **Ollama**: Local AI model deployment
- **Tripo**: AI-powered 3D model processing
- **Qwen**: Large language model integration

### Key Project Locations

```
B:\
├── unity\Unity_Project\          # Unity game projects
├── Sal_program\Underwater\Rust\  # Rust/Bevy projects
├── epic\                         # Unreal Engine installation
├── work_software\                # Development tools and applications
│   ├── Three.js\LangtonAnt3D\   # 3D visualization (current)
│   ├── FileConverter\           # C# .NET application
│   └── [various creative tools]
├── AI_Library\                   # AI learning resources
├── Ollama\                       # Local AI deployment
├── Tripo\                        # AI 3D modeling
├── Qwen\                         # Language models
└── 作品集\                       # Portfolio projects
```

### Development Workflow Patterns

**1. Modular System Architecture**
- Event-driven communication between components
- Configuration-driven behavior
- Reusable system patterns across projects

**2. Cross-Technology Integration**
- Unity ↔ Web (Three.js) data exchange
- AI-powered creative workflows
- Desktop application integration with web tools

**3. Data Visualization Emphasis**
- Mathematical algorithms (Langton's Ant)
- 3D scientific visualization
- Interactive data exploration

**4. Creative Technology Focus**
- Real-time graphics and rendering
- Procedural content generation
- Interactive digital art installations

### Common Development Practices

- **Type Safety**: TypeScript migration in progress, strict C#/.NET typing
- **Modularity**: Component-based architecture across all projects
- **Performance Optimization**: Efficient rendering, data processing pipelines
- **Documentation**: Comprehensive project documentation and architecture guides
- **Version Control**: Git-based workflow with GitHub integration

### Tools and Environment Setup

**IDEs and Editors:**
- Visual Studio (C#/.NET development)
- VS Code (web development, TypeScript)
- Zed (lightweight text editing)
- Unity Editor (game development)

**Build Systems:**
- Vite (web projects)
- dotnet CLI (.NET applications)
- Cargo (Rust projects)
- Unity Build System (game deployment)

**Quality Assurance:**
- ESLint + Prettier (code formatting)
- TypeScript strict mode
- Git hooks and automated testing

This development environment emphasizes creative technology applications, combining game development expertise with AI integration, data visualization, and interactive digital experiences.