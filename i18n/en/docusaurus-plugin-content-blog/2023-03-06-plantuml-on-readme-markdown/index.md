---
slug: plantuml-on-readme-markdown
title: Plantuml on Readme Markdown
authors: [crazytrau]
tags: [crazytrau, docusaurus, plantuml, markdown]
---
# Quick note
## Step
1. Ceate new UML 

    - [http://plantuml.com](http://plantuml.com/plantuml/form)

2. Fill UML 
    - Copy example from link [Declaring participant](https://plantuml.com/sequence-diagram#5d2ed256d73a7298)

3. Create link embeded
    - Click "Submit" 
    - Click "SVG" 
    - copy URL from Browser

4. Fill Markdown theo format

    - `![PlantUML model]( <<URL copy>> )`

## Réult
![PlantUML model](http://www.plantuml.com/plantuml/dsvg/JOyzJWCn44RxESLSW8By91852WIeGU824wyBIuudsECYjsVNNrQQAUodxrNlr4ogzMkcs_oda6vIZByTI-ClLP9WMXdtvXZwcIxQooJrlcplZk4t5BHOrSpBdHt3RoaMItRdSPzWvtSqYSb5Mbos3yVmUmgQSmoMj3G-EuO_q5-FFJBknp7yaUQ7drv72x_mhpA2tRx1leOwiuLv93gnWq2Rs_VOroPd3Z2knidZSAE4Jh5C_Ph_0G00)

# plantuml.com features ([more](https://plantuml.com/))
Diagrams are defined using a simple and intuitive language. (see PlantUML Language Reference Guide).
New users can read the quick start page. There is also a F.A.Q. page. PlantUML can be used within many other tools.
Images can be generated in PNG, in SVG or in LaTeX format. It is also possible to generate ASCII art diagrams (only for sequence diagrams).

1. PlantUML is a component that allows you to quickly write::
	-	Sequence diagram
	-	Usecase diagram
	-	Class diagram
	-	Object diagram
	-	Activity diagram (here is the legacy syntax)
	-	Component diagram
	-	Deployment diagram
	-	State diagram
	-	Timing diagram

2. The following non-UML diagrams are also supported:
	-	JSON data
	-	YAML data
	-	Extended Backus-Naur Form (EBNF) diagram
	-	Network diagram (nwdiag)
	-	Wireframe graphical interface or UI mockups (salt)
	-	Archimate diagram
	-	Specification and Description Language (SDL)
	-	Ditaa diagram
	-	Gantt diagram
	-	MindMap diagram
	-	Work Breakdown Structure diagram (WBS)
	-	Mathematic with AsciiMath or JLaTeXMath notation
	-	Entity Relationship diagram (IE/ER)

3. Furthermore:
    -   Hyperlinks and tooltips
    -   Creole: rich text, emoticons, unicode, icons
    -   OpenIconic icons
    -   Sprite icons
    -   AsciiMath mathematical expressions

# Reference sources:
- https://stackoverflow.com/a/32771815
- https://plantuml.com/