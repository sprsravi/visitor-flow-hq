<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getVisitors();
        break;
    case 'POST':
        createVisitor();
        break;
    case 'PUT':
        updateVisitor();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getVisitors() {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM visitors ORDER BY check_in_time DESC");
        $stmt->execute();
        $visitors = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($visitors);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch visitors: ' . $e->getMessage()]);
    }
}

function createVisitor() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['name'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Name is required']);
        return;
    }
    
    try {
        $id = generateUUID();
        $stmt = $pdo->prepare("
            INSERT INTO visitors (
                id, name, email, mobile, company, person_to_meet, 
                department, purpose, status, check_in_time
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        
        $stmt->execute([
            $id,
            $input['name'],
            $input['email'] ?? null,
            $input['mobile'] ?? null,
            $input['company'] ?? null,
            $input['person_to_meet'] ?? null,
            $input['department'] ?? null,
            $input['purpose'] ?? null,
            $input['status'] ?? 'checked-in'
        ]);
        
        // Fetch the created visitor
        $stmt = $pdo->prepare("SELECT * FROM visitors WHERE id = ?");
        $stmt->execute([$id]);
        $visitor = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode($visitor);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create visitor: ' . $e->getMessage()]);
    }
}

function updateVisitor() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("
            UPDATE visitors 
            SET check_out_time = ?, status = ?, updated_at = NOW()
            WHERE id = ?
        ");
        
        $stmt->execute([
            $input['check_out_time'] ?? date('Y-m-d H:i:s'),
            $input['status'] ?? 'checked-out',
            $input['id']
        ]);
        
        // Fetch the updated visitor
        $stmt = $pdo->prepare("SELECT * FROM visitors WHERE id = ?");
        $stmt->execute([$input['id']]);
        $visitor = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$visitor) {
            http_response_code(404);
            echo json_encode(['error' => 'Visitor not found']);
            return;
        }
        
        echo json_encode($visitor);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update visitor: ' . $e->getMessage()]);
    }
}
?>