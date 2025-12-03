from flask import Blueprint, jsonify, session
import json

classes_bp = Blueprint('classes', __name__)

@classes_bp.route('/classes', methods=['GET'])
def get_classes():
    if 'user' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    if session.get('role') != 'teacher':
        return jsonify({'error': 'Forbidden - Teacher access only'}), 403
    
    try:
        with open('data/classes.json') as f:
            classes_data = json.load(f)
        
        # Convert dictionary structure to list format for frontend
        classes_list = []
        for class_name, class_info in classes_data.items():
            classes_list.append({
                'id': class_info['id'],
                'name': class_info['name'],
                'description': class_info['description'],
                'studentCount': len(class_info.get('students', []))
            })
        
        return jsonify(classes_list)
    except FileNotFoundError:
        return jsonify({'error': 'Classes data not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Failed to load classes: {str(e)}'}), 500


@classes_bp.route('/class/<class_id>', methods=['GET'])
def get_class(class_id):
    if 'user' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    if session.get('role') != 'teacher':
        return jsonify({'error': 'Forbidden - Teacher access only'}), 403
    
    try:
        with open('data/classes.json') as f:
            classes_data = json.load(f)
        
        # Find class by ID
        for class_name, class_info in classes_data.items():
            if class_info['id'] == class_id:
                return jsonify(class_info)
        
        return jsonify({'error': 'Class not found'}), 404
    except FileNotFoundError:
        return jsonify({'error': 'Classes data not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Failed to load class: {str(e)}'}), 500


@classes_bp.route('/class/<class_id>/statistics', methods=['GET'])
def get_class_statistics(class_id):
    if 'user' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    if session.get('role') != 'teacher':
        return jsonify({'error': 'Forbidden - Teacher access only'}), 403
    
    try:
        with open('data/classes.json') as f:
            classes_data = json.load(f)
        
        # Find class by ID
        class_info = None
        for class_name, cls in classes_data.items():
            if cls['id'] == class_id:
                class_info = cls
                break
        
        if not class_info:
            return jsonify({'error': 'Class not found'}), 404
        
        students = class_info.get('students', [])
        
        # Stats
        if len(students) == 0:
            return jsonify({
                'totalStudents': 0,
                'averageGrade': 0,
                'averageProgress': 0,
                'studentsAtRisk': 0,
                'topPerformers': 0
            })
        
        total_grade = 0
        total_progress = 0
        for student in students:
            works = student.get('workAssigned', [])
            
            if works:
                average_grade = sum(grade['grade'] for grade in works) / len(works)
                student['grade'] = int(average_grade)
                average_progress = sum(progress['complete'] for progress in works) / len(works)
                student['workCompleted'] = int(average_progress)
            else:
                average_grade = 0
                student['grade'] = int(average_grade)
                average_progress = 0
                student['workCompleted'] = int(average_progress)

            total_grade += average_grade
            total_progress += average_progress
         
        average_grade = int(total_grade / len(students))
        average_progress = int(total_progress / len(students))
        
        # Students at risk: grade < 50 or progress < 40
        students_at_risk = sum(
            1 for student in students 
            if (sum(grade['grade'] for grade in student.get('workAssigned', [])) / len(student.get('workAssigned', [1])) < 50) or
                sum(progress['complete'] for progress in student.get('workAssigned', [])) / len(student.get('workAssigned', [1])) < 40
        )
        
        # Top performers: grade >= 85
        top_performers = sum(
            1 for student in students 
            if (sum(grade['grade'] for grade in student.get('workAssigned', [])) / len(student.get('workAssigned', [1])) >= 85)
        )

        # write calculated average grade and progress into classes file
        with open('data/classes.json', 'w') as f:
            json.dump(classes_data, f, indent=2)
        
        return jsonify({
            'totalStudents': len(students),
            'averageGrade': round(average_grade, 1),
            'averageProgress': round(average_progress, 1),
            'studentsAtRisk': students_at_risk,
            'topPerformers': top_performers
        })
    except FileNotFoundError:
        return jsonify({'error': 'Classes data not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Failed to calculate statistics: {str(e)}'}), 500
    
    
@classes_bp.route('/class/student/<student_id>', methods=['GET'])
def get_student_info(student_id):
    print("Fetching student route:", student_id)

    if 'user' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    if session.get('role') != 'teacher':
        return jsonify({'error': 'Forbidden - Teacher access only'}), 403
    
    try:
        with open('data/classes.json') as f:
            classes_data = json.load(f)
        
        # Find student by ID
        class_info = None
        student_info = None
        for class_name, cls in classes_data.items():
            students = cls.get('students', [])

            for std in students:
                if std['id'] == student_id:
                    class_info = cls
                    student_info = std
                    break

            if student_info:
                break
        
        # Check if student was found
        if not student_info:
            return jsonify({'error': 'Student not found'}), 404
    
        works = student_info.get('workAssigned', [])
        
        # Check if grade is empty
        if len(works) == 0:
            return jsonify({
                "classId": class_info["id"],
                "className": class_info["name"],
                "student": student_info,
            })
        
        return jsonify({
            "classId": class_info["id"],
            "className": class_info["name"],
            "student": student_info,
        })

    except FileNotFoundError:
        return jsonify({'error': 'Classes data not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Failed to load class: {str(e)}'}), 500