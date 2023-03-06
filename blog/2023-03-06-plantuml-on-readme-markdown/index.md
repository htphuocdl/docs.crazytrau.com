---
slug: plantuml-on-readme-markdown
title: Plantuml trong Readme Markdown
authors: [crazytrau]
tags: [crazytrau, docusaurus, plantuml, markdown]
---
# Quick note
## Các bước
1. Tạo mới 1 UML 

    - [http://plantuml.com](http://plantuml.com/plantuml/form)

2. Nhập UML 
    - Copy mẫu từ link [Declaring participant](https://plantuml.com/sequence-diagram#5d2ed256d73a7298)

3. Tạo ra link embeded
    - bấm "Submit" 
    - bấm "SVG" 
    - copy URL từ trình duyệt

4. Nhập vô Markdown theo format

    - `![PlantUML model]( <<URL đã copy>> )`

## Kết quả
![PlantUML model](http://www.plantuml.com/plantuml/dsvg/JOyzJWCn44RxESLSW8By91852WIeGU824wyBIuudsECYjsVNNrQQAUodxrNlr4ogzMkcs_oda6vIZByTI-ClLP9WMXdtvXZwcIxQooJrlcplZk4t5BHOrSpBdHt3RoaMItRdSPzWvtSqYSb5Mbos3yVmUmgQSmoMj3G-EuO_q5-FFJBknp7yaUQ7drv72x_mhpA2tRx1leOwiuLv93gnWq2Rs_VOroPd3Z2knidZSAE4Jh5C_Ph_0G00)

# Tính năng của plantuml.com ([Xem thêm](https://plantuml.com/))
Diagrams are defined using a simple and intuitive language. (see PlantUML Language Reference Guide).
New users can read the quick start page. There is also a F.A.Q. page. PlantUML can be used within many other tools.
Images can be generated in PNG, in SVG or in LaTeX format. It is also possible to generate ASCII art diagrams (only for sequence diagrams).

1. PlantUML gồm 1 số thành phần UML:
	-	Sequence diagram
	-	Usecase diagram
	-	Class diagram
	-	Object diagram
	-	Activity diagram (here is the legacy syntax)
	-	Component diagram
	-	Deployment diagram
	-	State diagram
	-	Timing diagram

2. Một số :
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

3. Hơn nữa:
    -   Hyperlinks and tooltips
    -   Creole: rich text, emoticons, unicode, icons
    -   OpenIconic icons
    -   Sprite icons
    -   AsciiMath mathematical expressions

# Reference sources:
- https://stackoverflow.com/a/32771815
- https://plantuml.com/