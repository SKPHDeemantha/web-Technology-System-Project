<link rel="stylesheet" href="../assets/css/admincss/analytics.css">
<?php
require_once '../../connect.php';

    $data = array();

    $roleQuery = "
        SELECT ur.role_name as role, COUNT(u.id) as count 
        FROM users u 
        JOIN user_roles ur ON u.role_id = ur.id 
        WHERE u.is_active = 1
        GROUP BY ur.role_name
    ";
    
    $roleResult = mysqli_query($con, $roleQuery);

    $data['userRoles'] = array();
    while ($row = mysqli_fetch_assoc($roleResult)) {
        $data['userRoles'][] = $row;
    }


    $platformQuery = "
        SELECT platform, COUNT(*) AS count
        FROM (
            SELECT
                CASE
                    WHEN user_agent LIKE '%Android%' THEN 'Mobile'
                    WHEN user_agent LIKE '%iPhone%' THEN 'Mobile'
                    WHEN user_agent LIKE '%iPad%' THEN 'Tablet'
                    WHEN user_agent LIKE '%Tablet%' THEN 'Tablet'
                    WHEN user_agent LIKE '%Windows%' THEN 'Desktop'
                    WHEN user_agent LIKE '%Macintosh%' THEN 'Desktop'
                    WHEN user_agent LIKE '%Linux%' THEN 'Desktop'
                    ELSE 'Unknown'
                END AS platform
            FROM audit_logs
            WHERE user_agent IS NOT NULL AND user_agent != ''
        ) AS t
        GROUP BY platform
    ";
    
    $platformResult = mysqli_query($con, $platformQuery);

    $data['platformUsage'] = array();
    while ($row = mysqli_fetch_assoc($platformResult)) {
        $data['platformUsage'][] = $row;
    }


    $activityQuery = "
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as activity_count
        FROM audit_logs 
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date
    ";
    
    $activityResult = mysqli_query($con, $activityQuery);
    $data['activityTrends'] = array();
    
    if ($activityResult && mysqli_num_rows($activityResult) > 0) {
        while ($row = mysqli_fetch_assoc($activityResult)) {
            $data['activityTrends'][] = $row;
        }
    } else {
        $data['activityTrends'] = generateSampleActivityData();
    }


    $totalUsersQuery = "SELECT COUNT(*) as total FROM users WHERE is_active = 1";
    $totalUsersResult = mysqli_query($con, $totalUsersQuery);
    if ($totalUsersResult) {
        $totalUsers = mysqli_fetch_assoc($totalUsersResult);
        $data['totalUsers'] = $totalUsers['total'];
    } else {
        $data['totalUsers'] = 0;
    }
    
    $totalCoursesQuery = "SELECT COUNT(*) as total FROM courses WHERE is_active = 1";
    $totalCoursesResult = mysqli_query($con, $totalCoursesQuery);
    if ($totalCoursesResult) {
        $totalCourses = mysqli_fetch_assoc($totalCoursesResult);
        $data['totalCourses'] = $totalCourses['total'];
    } else {
        $data['totalCourses'] = 0;
    }
    
    $totalCommunitiesQuery = "SELECT COUNT(*) as total FROM communities WHERE is_active = 1";
    $totalCommunitiesResult = mysqli_query($con, $totalCommunitiesQuery);
    if ($totalCommunitiesResult) {
        $totalCommunities = mysqli_fetch_assoc($totalCommunitiesResult);
        $data['totalCommunities'] = $totalCommunities['total'];
    } else {
        $data['totalCommunities'] = 0;
    }


    $communitiesQuery = "
        SELECT name, 
               (SELECT COUNT(*) FROM community_members WHERE community_id = communities.id) as member_count
        FROM communities 
        WHERE is_active = 1
        ORDER BY member_count DESC 
        LIMIT 5
    ";
    
    $communitiesResult = mysqli_query($con, $communitiesQuery);
    $data['topCommunities'] = array();
    
    if ($communitiesResult) {
        while ($row = mysqli_fetch_assoc($communitiesResult)) {
            $data['topCommunities'][] = $row;
        }
    }


    function generateSampleActivityData() {
      $activityData = array();
      $baseDate = new DateTime();
      
      for ($i = 6; $i >= 0; $i--) {
          $date = clone $baseDate;
          $date->modify("-$i days");
          
          $activityData[] = array(
              'date' => $date->format('Y-m-d'),
              'activity_count' => rand(5, 20)
          );
      }
      
      return $activityData;
    }

?>

<div class="d-flex justify-content-between align-items-center mb-4">
  <div>
    <h2>Analytics Dashboard</h2>
    <p class="text-muted">Comprehensive analytics and insights</p>
  </div>
  <div>
    <select id="analyticsPeriod" class="form-select form-select-sm w-auto d-inline-block">
      <option value="7">Last 7 days</option>
      <option value="30" selected>Last 30 days</option>
      <option value="90">Last 90 days</option>
    </select>
  </div>
</div>
<script src="../assets/js/admin/analytics.js"></script>

<div class="row">
  <div class="col-md-6 mb-4">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">User Roles Distribution</h5>
      </div>
      <div class="card-body">
        <canvas id="userRoleChart" height="250"></canvas>
      </div>
    </div>
  </div>
  <div class="col-md-6 mb-4">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Platform Usage</h5>
      </div>
      <div class="card-body">
        <canvas id="platformUsageChart" height="250"></canvas>
      </div>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-md-8 mb-4">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Activity Trends</h5>
      </div>
      <div class="card-body">
        <canvas id="activityTrendsChart" height="300"></canvas>
      </div>
    </div>
  </div>
  <div class="col-md-4 mb-4">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Top Communities</h5>
      </div>
      <div class="card-body">
        <div class="list-group list-group-flush">
          <div class="list-group-item d-flex justify-content-between align-items-center">
            Computer Science Club
            <span class="badge bg-purple rounded-pill">142</span>
          </div>
          <div class="list-group-item d-flex justify-content-between align-items-center">
            Math Study Group
            <span class="badge bg-purple rounded-pill">98</span>
          </div>
          <div class="list-group-item d-flex justify-content-between align-items-center">
            Art & Design Society
            <span class="badge bg-purple rounded-pill">76</span>
          </div>
          <div class="list-group-item d-flex justify-content-between align-items-center">
            Business Leaders Forum
            <span class="badge bg-purple rounded-pill">65</span>
          </div>
          <div class="list-group-item d-flex justify-content-between align-items-center">
            Environmental Club
            <span class="badge bg-purple rounded-pill">54</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
