using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace videochat_app.Migrations
{
    /// <inheritdoc />
    public partial class LookingForThing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LookingForProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdentityUserId = table.Column<string>(type: "text", nullable: false),
                    ProfileId = table.Column<int>(type: "integer", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    Avaliability = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    Frameworks = table.Column<string[]>(type: "text[]", nullable: false),
                    Industry = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LookingForProfiles", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LookingForProfiles_IdentityUserId",
                table: "LookingForProfiles",
                column: "IdentityUserId");

            migrationBuilder.CreateIndex(
                name: "IX_LookingForProfiles_ProfileId",
                table: "LookingForProfiles",
                column: "ProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LookingForProfiles");
        }
    }
}
